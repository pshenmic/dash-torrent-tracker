import { useEffect, useState } from 'react'
import { Torrent } from '../models/Torrent'
import schema from '../../data_contract_schema.json';
import { base58 } from '@scure/base';
import * as PEApi from '../utils/Api'

const DATA_CONTRACT_IDENTIFIER = '6hVQW16jyvZyGSQk2YVty4ND6bgFXozizYWnPt753uW5'

export default function CreateTorrent () {
  let dataContractFactory
  let documentFactory
  let identityPublicKeyClass

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect( () => {
    const run = async () => {
      const WASMDPP = await import('@dashevo/wasm-dpp')
      await WASMDPP.default()
      const {DocumentFactory, DataContractFactory, Identifier, IdentityPublicKey} = WASMDPP

      identityPublicKeyClass = IdentityPublicKey

      dataContractFactory = new DataContractFactory(7)
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
  const handleSubmit = async e => {

    try {
      const torrent = new Torrent(form.name, form.description,form.magnet, form.identity, new Date())

      const identity = await PEApi.getIdentity(form.identity)
      const identityContractNonce = await PEApi.getIdentityContractNonce(form.identity)

      const dataContract = await dataContractFactory.create(base58.decode(form.identity), BigInt(1), schema)

      const document = await documentFactory.create(dataContract, form.identity, 'torrent', {
        name: form.name,
        description: form.description,
        magnet: form.magnet
      })

      const identityPublicKey = identityPublicKeyClass.fromBuffer(Buffer.from(identity.raw, 'hex'))

      const stateTransition = documentFactory.createStateTransition({ create: [document] }, {
        [form.identity]: {
          [DATA_CONTRACT_IDENTIFIER]: "1",
        },
      });

      stateTransition.sign(
        identityPublicKey,
        Buffer.from(form.privateKey, 'hex'),
      );

      console.log('stateTransition', stateTransition.toBuffer().toString('hex'))
      console.log('stateTransition', stateTransition.toBuffer().toString('base64'))
    }catch (e) {
      setError(e.toString())
      console.error('Error during submit:', e)
    }
  }

  return <div>
    {error ? <div className={"leading-none font-normal text-lg pt-12"}>Error during submit: {error}</div> : <div/>}
    {loading ? <div className={"leading-none font-normal text-lg pt-12"}>Loading WASM DPP</div> : <div/>}
    {!loading && !error ? <div className={'flex flex-col'}>
      <div>
        <div className={'text-sm leading-none font-normal pb-2'}>Name:</div>
        <input type={'text'} className={'border-2 border-gray-700 rounded-lg p-2 w-full'}
               onChange={(e) => handleInputChange('name', e)}
               value={form.name}
               placeholder={"Torrent name"}
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
