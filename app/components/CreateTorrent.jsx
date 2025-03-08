import { useEffect, useState } from 'react'
import * as PEApi from '../utils/Api'
import { useNavigate } from 'react-router'

const DATA_CONTRACT_IDENTIFIER = '6hVQW16jyvZyGSQk2YVty4ND6bgFXozizYWnPt753uW5'

let dataContractFactory
let dataContractFacade
let documentFactory
let identityPublicKeyClass

export default function CreateTorrent () {
  let navigate = useNavigate();

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [action, setAction] = useState('create')

  useEffect( () => {
    const run = async () => {
      const WASMDPP = await import('@dashevo/wasm-dpp')
      await WASMDPP.default()
      const {DocumentFactory, DataContractFactory, DataContractFacade, Identifier, IdentityPublicKey} = WASMDPP

      identityPublicKeyClass = IdentityPublicKey

      dataContractFactory = new DataContractFactory(7)
      dataContractFacade = new DataContractFacade(7)
      documentFactory = new DocumentFactory(7)
    }

    setLoading(true)
    run().catch(console.error).finally(() => setLoading(false))
  }, [])

  const [form, setForm] = useState({
    name: '',
    description: '',
    identity: '',
    magnet: '',
    privateKey: ''
  })

  const handleInputChange = (key, e) => {
    setForm({...form, [key]: e.target.value})
  }

  const setDocumentAction = (action) => {
    setAction(action)
  }

  const handleSubmit = async e => {

    try {
      const identity = await PEApi.getIdentity(form.identity)

      const [identityPublicKey] = identity.publicKeys.filter((publicKey) => String(publicKey.keyId) === form.keyId)

      if (!identityPublicKey) {
        throw new Error(`Could not find identity public key with id ${form.keyId} in the identity ${form.identity}`)
      }

      const {identityContractNonce} = await PEApi.getIdentityContractNonce(DATA_CONTRACT_IDENTIFIER, form.identity)

      const {base64} = await PEApi.getRawDataContract(DATA_CONTRACT_IDENTIFIER)

      const dataContract = await dataContractFactory.createFromBuffer(Buffer.from(base64, 'base64'))

      let document

      if (action === 'create') {
        document = await documentFactory.create(dataContract, form.identity, 'torrent', {
          name: form.name,
          description: form.description,
          magnet: form.magnet
        })
      } else {
        const {base64} = await PEApi.getRawDocument(form.identifier, DATA_CONTRACT_IDENTIFIER, 'torrent')

        document = await documentFactory.createExtendedDocumentFromDocumentBuffer(Buffer.from(base64, 'base64'), 'torrent', dataContract)
      }

      const stateTransition = documentFactory.createStateTransition({ [action]: [document] }, {
        [form.identity]: {
          [DATA_CONTRACT_IDENTIFIER]: (BigInt(identityContractNonce) + BigInt(1)).toString(10),
        },
      });

      stateTransition.sign(
        identityPublicKeyClass.fromBuffer(Buffer.from(identityPublicKey.raw, 'hex')),
        Buffer.from(form.privateKey, 'hex'),
      );

      await PEApi.broadcastTx(stateTransition.toBuffer().toString('base64'))

      navigate('/')
    } catch (e) {
      setError(e.toString())
      console.error('Error during submit:', e)
    }
  }

  return <div>
    <div className={"mb-6"}>
      <button className={`rounded-xl mt-4 p-2 ml-2 ${action === 'create' ? 'bg-blue-700': 'bg-blue-400'}`}
              onClick={() => setDocumentAction('create')}>Create torrent
      </button>
      <button className={`rounded-xl mt-4 p-2 ml-2 ${action === 'replace' ? 'bg-yellow-700': 'bg-yellow-400'}`}
              onClick={() => setDocumentAction('replace')}>Update torrent</button>
      <button className={`rounded-xl mt-4 p-2 ml-2 ${action === 'delete' ? 'bg-red-700': 'bg-red-400'}`}
              onClick={() => setDocumentAction('delete')}>Delete torrent</button>
    </div>
    {error ? <div className={'leading-none font-normal text-lg pt-12'}>Error during submit: {error}</div> : <div/>}
    {loading ? <div className={"leading-none font-normal text-lg pt-12"}>Loading WASM DPP</div> : <div/>}
    {!loading && !error ? <div className={'flex flex-col'}>
        {action !== 'create' ? <div>
          <div className={'text-sm leading-none font-normal pb-2'}>Torrent Identifier:</div>
          <input type={'text'} className={'border-2 border-gray-700 rounded-lg p-2 w-full'}
                 onChange={(e) => handleInputChange('identifier', e)}
                 value={form.identifier}
                 placeholder={'5Quf1y4GrqygGLLUwNHntxHBCguvUiVaMv2kWh7HNFAd'}
          />
        </div> : <div/>}

      <div>
        <div className={'text-sm leading-none font-normal pb-2'}>Name:</div>
        <input type={'text'} className={'border-2 border-gray-700 rounded-lg p-2 w-full'}
               onChange={(e) => handleInputChange('name', e)}
               value={form.name}
               placeholder={'Torrent name'}
        />
      </div>

      <div>
        <div className={'text-sm leading-none font-normal pb-2 pt-2'}>Description:</div>
        <input type={'text'} className={'border-2 border-gray-700 rounded-lg p-2 w-full'}
               onChange={(e) => handleInputChange('description', e)}
               value={form.description}
               placeholder={"Description"}
        />
      </div>

      <div>
        <div className={'text-sm leading-none font-normal text-lg pb-2 pt-2'}>Magnet:</div>
        <input type={'text'} className={'border-2 border-gray-700 rounded-lg p-2 w-full'}
               onChange={(e) => handleInputChange('magnet', e)}
               value={form.magnet}
               placeholder={"magnet:?xt=urn:btih:...."}
        />
      </div>

      <div>
        <div className={'text-sm leading-none font-normal text-lg pb-2 pt-2'}>Identity:</div>
        <input type={'text'} className={'border-2 border-gray-700 rounded-lg p-2 w-full'}
               onChange={(e) => handleInputChange('identity', e)}
               value={form.identity}
               placeholder={"BjixEUbqeUZK7BRdqtLgjzwFBovx4BRwS2iwhMriiYqp"}
        />
      </div>

      <div>
        <div className={'text-sm leading-none font-normal text-lg pb-2 pt-2'}>Identity Public Key ID:</div>
        <input type={'text'} className={'border-2 border-gray-700 rounded-lg p-2 w-full'}
               onChange={(e) => handleInputChange('keyId', e)}
               value={form.keyId}
               placeholder={"1"}
        />
      </div>

      <div>
        <div className={'text-sm leading-none font-normal text-lg pb-2 pt-2'}>Private Key (from your identity):</div>
        <input type={'text'} className={'border-2 border-gray-700 rounded-lg p-2 w-full'}
               onChange={(e) => handleInputChange('privateKey', e)}
               value={form.privateKey}
               placeholder={"f00eab0432501e140cc00816a91934b2551564a05bd9176061b098e33112adf0"}
        />
      </div>

      <div>
        <button className={"rounded-xl bg-blue-300 mt-4 p-2"} onClick={handleSubmit}>Submit</button>
      </div>
    </div> : <div></div>}
  </div>
}
