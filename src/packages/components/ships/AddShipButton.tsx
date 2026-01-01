'use client'

import { CreateShipForm } from './CreateShipForm'

export function AddShipButton() {
  return (
    <>
      <button
        className='btn btn-primary self-start flex gap-1'
        data-overlay='#add-ship-modal'
        aria-label='Open add ship modal'
        aria-expanded='false'
      >
        <span className='icon-[tabler--circle-plus]' />
        <span>Add ship</span>
      </button>

      <div
        id='add-ship-modal'
        className='overlay modal overlay-open:opacity-100 hidden modal-middle'
        role='dialog'
        tabIndex={-1}
      >
        <div className='modal-dialog overlay-open:opacity-100'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h3 className='modal-title'>Add New Ship</h3>
              <button
                type='button'
                className='btn btn-text btn-circle btn-sm absolute end-3 top-3'
                aria-label='Close'
                data-overlay='#add-ship-modal'
                aria-expanded='false'
              >
                <span className='icon-[tabler--x] size-4'></span>
              </button>
            </div>
            <div className='modal-body'>
              <CreateShipForm modalId='add-ship-modal' />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
