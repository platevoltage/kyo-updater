import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import { Button } from '@mui/material'
import { useEffect, useRef, useState } from 'react'

function App(): React.JSX.Element {
  function handleFlash(): void {
    window.electron.ipcRenderer.send('flash')
  }

  const [statusBox, setStatusBox] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleStdout(msg: string): void {
      console.log(msg)
      setStatusBox((prev) => prev + '\n' + msg)
    }

    function handleStderr(msg: string): void {
      console.error(msg)
      setStatusBox((prev) => prev + '\n' + msg)
    }

    window.api.stdout(handleStdout)
    window.api.stderr(handleStderr)

    // optional cleanup if your preload uses ipcRenderer.on
    return () => {
      window.api.removeStdoutListener?.(handleStdout)
      window.api.removeStderrListener?.(handleStderr)
    }
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [statusBox])

  return (
    <div
      style={{ width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
    >
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Button variant="contained" onClick={handleFlash}>
          Flash
        </Button>
      </div>
      <div style={{ margin: 20 }}>
        <div
          ref={containerRef}
          style={{
            backgroundColor: '#555555',
            width: '100%',
            height: '400px',
            borderRadius: '6px',
            border: '1px solid black',
            overflow: 'scroll',
            fontSize: '.8em',
            padding: '10px'
          }}
        >
          <pre>{statusBox}</pre>
        </div>
      </div>
    </div>
  )
}

export default App
