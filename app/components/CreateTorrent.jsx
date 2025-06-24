import { useEffect, useState } from 'react'
import * as PEApi from '../utils/Api'
import { useNavigate } from 'react-router'

const DATA_CONTRACT_IDENTIFIER = '6hVQW16jyvZyGSQk2YVty4ND6bgFXozizYWnPt753uW5'
const DOCUMENT_TYPE = 'torrent'


let dataContractFactory
let dataContractFacade
let documentFactory
let identityPublicKeyClass

export default function CreateTorrent () {
  let navigate = useNavigate();

  const [extensionLoaded, setExtensionLoaded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect( () => {
    const {dashPlatformSDK} = window

    setExtensionLoaded(!!dashPlatformSDK)

    const run = async () => {

    }

    setLoading(true)
    run().catch(console.error).finally(() => setLoading(false))
  }, [])

  const [form, setForm] = useState({
    name: '',
    description: '',
    identity: '',
    magnet: '',
    keyId: "1",
    privateKey: ''
  })

  const handleInputChange = (key, e) => {
    setForm({...form, [key]: e.target.value})
  }

  const handleSubmit = async e => {

    try {
      // const identity = await PEApi.getIdentity(form.identity)
      //
      // const [identityPublicKey] = identity.publicKeys.filter((publicKey) => String(publicKey.keyId) === form.keyId)
      //
      // if (!identityPublicKey) {
      //   throw new Error(`Could not find identity public key with id ${form.keyId} in the identity ${form.identity}`)
      // }
      //
      // const {identityContractNonce} = await PEApi.getIdentityContractNonce(DATA_CONTRACT_IDENTIFIER, form.identity)
      //
      // const data = {
      //   name: form.name,
      //   description: form.description,
      //   magnet: form.magnet
      // }
      //
      // console.log(JSON.stringify(data), DOCUMENT_TYPE, BigInt(identityContractNonce), DATA_CONTRACT_IDENTIFIER, form.identity)
      // document = await window.dashPlatformSDK.documents.create(DATA_CONTRACT_IDENTIFIER, DOCUMENT_TYPE, data, BigInt(identityContractNonce), identity)
      //
      // console.log('document', document)
    } catch (e) {
      setError(e.toString())
      console.error('Error during submit:', e)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 sm:p-8">
      {/* Form Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Add New Torrent
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Share your torrent on the decentralized Dash Platform
        </p>
      </div>

      {/* Extension Warning */}
      {!extensionLoaded && (
        <div className="mb-8 rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg 
                className="h-5 w-5 text-amber-400 dark:text-amber-500" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                  clipRule="evenodd" 
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Dash Platform Extension Required
              </h3>
              <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                <p>
                  Dash Platform extension is not loaded. You must install the extension in order to make write actions.
                </p>
                <p className="mt-2">
                  <a 
                    href="#" 
                    className="font-medium underline hover:text-amber-800 dark:hover:text-amber-200"
                  >
                    Learn how to install the extension →
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Show form only if extension is loaded */}
      {extensionLoaded && (
        <>
          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error during submit</h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Fields */}
          {!error && (
            <form className="space-y-6">

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              onChange={(e) => handleInputChange('name', e)}
              value={form.name}
              placeholder="Enter torrent name"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors resize-none"
              onChange={(e) => handleInputChange('description', e)}
              value={form.description}
              placeholder="Describe your torrent content"
              required
            />
          </div>

          <div>
            <label htmlFor="magnet" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Magnet Link <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="magnet"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors font-mono text-sm"
              onChange={(e) => handleInputChange('magnet', e)}
              value={form.magnet}
              placeholder="magnet:?xt=urn:btih:...."
              required
            />
          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Identity Information</h3>

            <div className="space-y-6">
              <div>
                <label htmlFor="identity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Identity <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="identity"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors font-mono text-sm"
                  onChange={(e) => handleInputChange('identity', e)}
                  value={form.identity}
                  placeholder="BjixEUbqeUZK7BRdqtLgjzwFBovx4BRwS2iwhMriiYqp"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="keyId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Identity Public Key ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="keyId"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    onChange={(e) => handleInputChange('keyId', e)}
                    value={form.keyId}
                    placeholder="1"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="privateKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Private Key <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="privateKey"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors font-mono text-sm"
                    onChange={(e) => handleInputChange('privateKey', e)}
                    value={form.privateKey}
                    placeholder="Enter your private key"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-600"
              disabled={!extensionLoaded}
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Torrent
            </button>
          </div>
            </form>
          )}
        </>
      )}
    </div>
  )
}
