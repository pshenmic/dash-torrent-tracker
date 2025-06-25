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
  const [appConnected, setAppConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [accounts, setAccounts] = useState([])
  const [selectedAccount, setSelectedAccount] = useState('')
  const [connectWalletError, setConnectWalletError] = useState('')

  useEffect( () => {
    const {dashPlatformSDK} = window

    console.log(dashPlatformSDK)

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

  const handleConnectWallet = async () => {
    const {dashPlatformSDK} = window

    setConnectWalletError('');

    try {
      const { identities, currentIdentity } = await dashPlatformSDK.signer.connect(window.location.origin)

      setAppConnected(true);
      setAccounts(identities);
    } catch (err) {
      console.error(err)
      setConnectWalletError(err.message || 'Failed to connect to wallet. Please try again.');
    }
  }

  const handleSubmit = async e => {

    try {
      const {dashPlatformSDK} = window


      //const identity = await dashPlatformSDK.identities.getByIdentifier(selectedAccount)
      //
      // const [identityPublicKey] = identity.publicKeys.filter((publicKey) => String(publicKey.keyId) === form.keyId)
      //
      // if (!identityPublicKey) {
      //   throw new Error(`Could not find identity public key with id ${form.keyId} in the identity ${form.identity}`)
      // }
      //
      const identityContractNonce = await dashPlatformSDK.identities.getIdentityContractNonce(selectedAccount, DATA_CONTRACT_IDENTIFIER)

      console.log(identityContractNonce)

      const data = {
        name: form.name,
        description: form.description,
        magnet: form.magnet
      }

      const document = await window.dashPlatformSDK.documents.create(DATA_CONTRACT_IDENTIFIER, DOCUMENT_TYPE, data, selectedAccount, identityContractNonce + 1n)
      const stateTransition = await dashPlatformSDK.stateTransitions.documentsBatch.create(document, identityContractNonce + 1n)

      await dashPlatformSDK.signer.signAndBroadcast(stateTransition)
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

          {/* Connection Status */}
          {appConnected && (
            <div className="mb-6 flex items-center justify-between rounded-lg bg-green-50 dark:bg-green-900/20 px-4 py-3 border border-green-200 dark:border-green-900">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Wallet connected
                  </p>
                  {selectedAccount && (
                    <p className="text-xs text-green-700 dark:text-green-300 mt-0.5">
                      Active: {selectedAccount.substring(0, 8)}...{selectedAccount.substring(selectedAccount.length - 6)}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  // TODO: Implement disconnect logic
                  console.log('Disconnect wallet clicked')
                  setAppConnected(false)
                  setSelectedAccount('')
                  setAccounts([])
                }}
                className="text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium transition-colors"
              >
                Disconnect
              </button>
            </div>
          )}

          {/* Form Fields */}
          {!error && appConnected && (
            <form className="space-y-6">

          {/* Account Selector */}
          <div>
            <label htmlFor="account" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Account <span className="text-red-500">*</span>
            </label>
            <select
              id="account"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              required
            >
              <option value="" disabled>Choose an account</option>
              {accounts.map((identity, index) => (
                <option key={index} value={identity}>
                  {identity}
                </option>
              ))}
            </select>
          </div>

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

            </form>
          )}

          {/* Action Buttons */}
          <div className="pt-6 flex justify-end">
            {!appConnected ? (
              <div className="w-full flex flex-col items-end">
                <button
                  type="button"
                  onClick={handleConnectWallet}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Connect Wallet
                </button>
                {connectWalletError && (
                  <div className="mt-4 w-full rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 p-3 text-sm text-red-700 dark:text-red-300">
                    {connectWalletError}
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-600"
                disabled={!extensionLoaded || !selectedAccount}
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Torrent
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
