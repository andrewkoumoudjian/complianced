import { useState } from 'react'
import {
  ProgressIndicator,
  ProgressStep,
  Form,
  TextInput,
  Button,
  Tabs,
  Tab,
  DataTable,
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  FileUploader,
  RadioButtonGroup,
  RadioButton,
  Slider,
} from '@carbon/react'
import './App.css'

function AccountWizard() {
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

function RiskQuestionnaire() {
  const [risk, setRisk] = useState(5)
  const [knowledge, setKnowledge] = useState('avg')

  const score = risk + (knowledge === 'high' ? 5 : knowledge === 'low' ? -5 : 0)

  return (
    <Form className="form">
      <Slider
        id="risk"
        min={0}
        max={10}
        value={risk}
        onChange={({ value }) => setRisk(value)}
        labelText="Risk tolerance"
      />
      <RadioButtonGroup
        legendText="Investment knowledge"
        valueSelected={knowledge}
        onChange={(val) => setKnowledge(val as string)}
        name="knowledge"
      >
        <RadioButton value="low" id="k-low" labelText="Low" />
        <RadioButton value="avg" id="k-avg" labelText="Average" />
        <RadioButton value="high" id="k-high" labelText="High" />
      </RadioButtonGroup>
      <p>Calculated score: {score}</p>
    </Form>
  )
}

function TradeBlotter() {
  const rows = [
    { id: '1', symbol: 'ABC', qty: 100, status: 'ok' },
    { id: '2', symbol: 'XYZ', qty: 5000, status: 'flag' },
  ]
  const headers = [
    { key: 'symbol', header: 'Symbol' },
    { key: 'qty', header: 'Qty' },
    { key: 'status', header: 'Status' },
  ]

  return (
    <DataTable rows={rows} headers={headers}>
      {({ rows, headers, getHeaderProps }) => (
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((h) => (
                <TableHeader key={h.key} {...getHeaderProps({ header: h })}>
                  {h.header}
                </TableHeader>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.cells[0].value}</TableCell>
                <TableCell>{row.cells[1].value}</TableCell>
                <TableCell>{row.cells[2].value === 'flag' ? '⚠️' : '✔️'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </DataTable>
  )
}

function DocumentVault() {
  return (
    <div className="form">
      <FileUploader buttonLabel="Add files" labelDescription="Upload client docs" />
    </div>
  )
}

function App() {
  const [tab, setTab] = useState(0)

  return (
    <div className="container">
      <Tabs selectedIndex={tab} onChange={({ selectedIndex }) => setTab(selectedIndex)}>
        <Tab label="Account">
          <AccountWizard />
        </Tab>
        <Tab label="Risk Profile">
          <RiskQuestionnaire />
        </Tab>
        <Tab label="Trades">
          <TradeBlotter />
        </Tab>
        <Tab label="Documents">
          <DocumentVault />
        </Tab>
      </Tabs>
    </div>
  )
}

export default App
