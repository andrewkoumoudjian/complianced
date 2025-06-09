import { useState } from 'react'
import {
  ProgressIndicator,
  ProgressStep,
  Form,
  TextInput,
  Button,
} from '@carbon/react'
import './App.css'

function App() {
  const [step, setStep] = useState(0)

  const next = () => setStep((s) => Math.min(s + 1, 4))
  const prev = () => setStep((s) => Math.max(s - 1, 0))

  return (
    <div className="container">
      <h1>Account Opening</h1>
      <ProgressIndicator currentIndex={step} spaceEqually>
        <ProgressStep label="Client Info" description="step 1" />
        <ProgressStep label="ID Verify" description="step 2" />
        <ProgressStep label="Agreements" description="step 3" />
        <ProgressStep label="Disclosures" description="step 4" />
        <ProgressStep label="Confirm" description="step 5" />
      </ProgressIndicator>
      {step === 0 && (
        <Form className="form">
          <TextInput id="first-name" labelText="First name" />
          <TextInput id="last-name" labelText="Last name" />
          <Button onClick={next}>Next</Button>
        </Form>
      )}
      {step === 1 && (
        <Form className="form">
          <TextInput id="id-num" labelText="Government ID Number" />
          <Button kind="secondary" onClick={prev}>
            Back
          </Button>
          <Button onClick={next}>Next</Button>
        </Form>
      )}
      {step === 2 && (
        <Form className="form">
          <TextInput id="agreement" labelText="Signed Agreement" />
          <Button kind="secondary" onClick={prev}>
            Back
          </Button>
          <Button onClick={next}>Next</Button>
        </Form>
      )}
      {step === 3 && (
        <Form className="form">
          <TextInput id="disclosures" labelText="Disclosure delivery" />
          <Button kind="secondary" onClick={prev}>
            Back
          </Button>
          <Button onClick={next}>Next</Button>
        </Form>
      )}
      {step === 4 && (
        <Form className="form">
          <p>Review and confirm all information.</p>
          <Button kind="secondary" onClick={prev}>
            Back
          </Button>
          <Button kind="primary">Submit</Button>
        </Form>
      )}
    </div>
  )
}

export default App
