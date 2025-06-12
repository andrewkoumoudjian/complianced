import {
  Content,
  Header,
  HeaderName,
  SkipToContent,
  SideNav,
  SideNavItems,
  SideNavLink,
  Select,
  SelectItem,
  Button,
  Form,
  FormGroup,
  TextInput,
  PasswordInput,
  Modal,
  ToastNotification,
  Grid,
  Column,
  ProgressIndicator,
  ProgressStep,
  DatePicker,
  DatePickerInput,
  FileUploader,
  Checkbox,
  NumberInput,
  RadioButtonGroup,
  RadioButton,
  Slider,
  Tag,
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Search,
  Dropdown,
  Pagination,
  ComboBox,
  InlineNotification,
  HeaderGlobalAction, // For placing button in header actions
  OverflowMenu,
  OverflowMenuItem,
  // Modal is already imported
  // Tile, // Using Modal instead of Tile for Quick View
  // FormLabel, // Might not be needed if TextInput/DatePicker labels suffice
} from '@carbon/react'
import { Trade20, View16, TrashCan16 } from '@carbon/icons-react'; // Icon for the trade button and overflow menu
import { useState, ChangeEvent, useEffect } from 'react' // Added ChangeEvent, useEffect
import './App.css'

// Define Product Type (reused for ComboBox items for simplicity)
interface Product { // Also used for ComboBox items
  id: string;
  text: string; // ComboBox uses 'text' or 'label'
  symbol?: string; // Optional for ComboBox context if `text` includes symbol
  category?: 'Stocks' | 'Bonds' | 'ETFs' | 'Mutual Funds' | 'Alternatives';
  riskLevel?: 'Low' | 'Medium' | 'High';
  details?: string;
}

interface ComboBoxItem {
    id: string;
    text: string;
    risk?: 'Low' | 'Medium' | 'High'; // For suitability logic
}

// Define Trade Type for Blotter
interface Trade {
  id: string;
  timestamp: Date;
  symbol: string;
  orderType: 'Buy' | 'Sell';
  quantity: number;
  price: number;
  status: 'Pending' | 'Executed' | 'Cancelled' | 'Flagged';
  aiFlags: Array<{ type: 'error' | 'warning' | 'info'; message: string }>;
}


interface ToastProps {
  kind: 'error' | 'info' | 'success' | 'warning';
  title: string;
  subtitle: string;
  timeout?: number;
}

// Login Form Component
const LoginForm = ({ onLoginSuccess, showToast }: { onLoginSuccess: () => void; showToast: (props: ToastProps) => void }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate successful login
    if (username && password) {
      onLoginSuccess()
      showToast({
        kind: 'success',
        title: 'Login Successful',
        subtitle: 'Welcome back!',
        timeout: 3000,
      })
    } else {
      showToast({
        kind: 'error',
        title: 'Login Failed',
        subtitle: 'Please enter username and password.',
        timeout: 3000,
      })
    }
  }

  return (
    <Grid style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Column lg={4} md={6} sm={4}>
        <Form onSubmit={handleSubmit} style={{ backgroundColor: '#f4f4f4', padding: '2rem', borderRadius: '8px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Login</h2>
          <FormGroup legendText="">
            <TextInput
              id="username"
              labelText="Username/Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ marginBottom: '1rem' }}
            />
          </FormGroup>
          <FormGroup legendText="">
            <PasswordInput
              id="password"
              labelText="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ marginBottom: '1.5rem' }}
            />
          </FormGroup>
          <Button type="submit" style={{ width: '100%' }}>Login</Button>
        </Form>
      </Column>
    </Grid>
  )
}

// MFA Setup Modal Component
const MfaSetupModal = ({ isOpen, onClose, showToast }: { isOpen: boolean; onClose: () => void; showToast: (props: ToastProps) => void }) => {
  const handleMfaSubmit = () => {
    // Simulate MFA setup
    showToast({
      kind: 'success',
      title: 'MFA Setup Complete',
      subtitle: 'Multi-Factor Authentication has been configured.',
      timeout: 3000,
    })
    onClose()
  }

  return (
    <Modal
      open={isOpen}
      onRequestClose={onClose}
      modalHeading="Setup Multi-Factor Authentication"
      primaryButtonText="Complete Setup"
      secondaryButtonText="Cancel"
      onRequestSubmit={handleMfaSubmit}
    >
      <p style={{ marginBottom: '1rem' }}>Scan the QR code with your authenticator app:</p>
      <div style={{ padding: '1rem', backgroundColor: '#e0e0e0', textAlign: 'center', marginBottom: '1rem' }}>
        [QR Code Placeholder]
      </div>
      <p>Then enter the code from your app to verify.</p>
      {/* Placeholder for code input if needed, for now just completing */}
    </Modal>
  )
}


// Main App Components (Header, SideNav, Content - slightly modified Content)

// Account Opening Wizard Component
const AccountOpeningWizard = ({ showToast }: { showToast: (props: ToastProps) => void }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [clientInfo, setClientInfo] = useState({ firstName: '', lastName: '', email: '', dob: '' })
  const [idVerify, setIdVerify] = useState<{idNumber: string; files: File[]}>({ idNumber: '', files: [] }) // Type files for clarity
  const [agreements, setAgreements] = useState({ agreed: false })

  const steps = [
    { label: 'Client Info', description: 'Step 1: Provide client details' },
    { label: 'ID Verify', description: 'Step 2: Upload identification' },
    { label: 'Agreements', description: 'Step 3: Review and accept agreements' },
    { label: 'Disclosures', description: 'Step 4: Review disclosures' },
    { label: 'Confirm', description: 'Step 5: Confirm and submit' },
  ]

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

  const handleClientInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientInfo({ ...clientInfo, [e.target.id]: e.target.value })
  }
  const handleDobChange = (dates: Date[]) => { // DatePicker returns an array of dates
    if (dates && dates.length > 0) {
      setClientInfo({ ...clientInfo, dob: dates[0].toLocaleDateString() });
    }
  };
  const handleIdVerifyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdVerify({ ...idVerify, [e.target.id]: e.target.value })
  }
  // FileUploader is more complex; for now, we'll just acknowledge it.
  const handleFileChange = (event: ChangeEvent<HTMLInputElement & { files: File[] }>) => {
    // Storing the actual File objects if needed, or just filenames.
    // For this placeholder, logging is fine. If `event.target.files` exists.
    if (event.target.files) {
      setIdVerify(prevState => ({ ...prevState, files: Array.from(event.target.files) }));
      console.log('Files selected:', event.target.files);
    }
  };


  const handleSubmitWizard = () => {
    // Placeholder for actual submission logic
    console.log('Wizard Submitted:', { clientInfo, idVerify, agreements })
    showToast({
      kind: 'success',
      title: 'Application Submitted',
      subtitle: 'Your account application has been received.',
      timeout: 5000,
    })
    // Optionally reset state or navigate away
    setCurrentStep(0) // Reset to first step for now
  }

  return (
    <Content id="account-wizard-content" style={{ padding: '1rem' }}>
      <h2>Account Opening</h2>
      <ProgressIndicator currentIndex={currentStep} spaceEqually style={{ marginBottom: '2rem' }}>
        {steps.map((step, index) => (
          <ProgressStep key={index} label={step.label} description={step.description} />
        ))}
      </ProgressIndicator>

      <Form style={{ marginBottom: '2rem' }}>
        {currentStep === 0 && (
          <FormGroup legendText="Client Information">
            <TextInput id="firstName" labelText="First Name" value={clientInfo.firstName} onChange={handleClientInfoChange} style={{ marginBottom: '1rem' }} />
            <TextInput id="lastName" labelText="Last Name" value={clientInfo.lastName} onChange={handleClientInfoChange} style={{ marginBottom: '1rem' }} />
            <TextInput id="email" type="email" labelText="Email" value={clientInfo.email} onChange={handleClientInfoChange} style={{ marginBottom: '1rem' }} />
            <DatePicker datePickerType="single" onChange={handleDobChange} dateFormat="m/d/Y">
              <DatePickerInput id="dob" placeholder="mm/dd/yyyy" labelText="Date of Birth" />
            </DatePicker>
          </FormGroup>
        )}
        {currentStep === 1 && (
          <FormGroup legendText="ID Verification">
            <TextInput id="idNumber" labelText="Government ID Number" value={idVerify.idNumber} onChange={handleIdVerifyChange} style={{ marginBottom: '1rem' }} />
            <FileUploader
              labelTitle="Upload ID Document"
              buttonLabel="Add file"
              filenameStatus="edit"
              accept={['.jpg', '.png', '.pdf']}
              multiple={false}
              onChange={handleFileChange} // Placeholder
              iconDescription="Clear file"
            />
          </FormGroup>
        )}
        {currentStep === 2 && (
          <FormGroup legendText="Agreements">
            <p style={{ marginBottom: '1rem' }}>Please review the following agreements...</p>
            <Checkbox labelText="I have read and agree to the terms and conditions." id="agreed" checked={agreements.agreed} onChange={(_event, { checked }) => setAgreements({ ...agreements, agreed: checked })} />
          </FormGroup>
        )}
        {currentStep === 3 && (
          <FormGroup legendText="Disclosures">
            <p>Please review the following disclosures...</p>
            {/* Placeholder for disclosure text */}
          </FormGroup>
        )}
        {currentStep === 4 && (
          <FormGroup legendText="Confirm Application">
            <p>Please review your information before submitting:</p>
            <p><strong>Client Info:</strong> {clientInfo.firstName} {clientInfo.lastName}, {clientInfo.email}, DOB: {clientInfo.dob}</p>
            <p><strong>ID Number:</strong> {idVerify.idNumber}</p>
            <p><strong>Agreements:</strong> {agreements.agreed ? 'Agreed' : 'Not Agreed'}</p>
            {/* Placeholder for full summary */}
          </FormGroup>
        )}
      </Form>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {currentStep > 0 && <Button kind="secondary" onClick={handleBack}>Back</Button>}
        {currentStep < steps.length - 1 && <Button onClick={handleNext}>Next</Button>}
        {currentStep === steps.length - 1 && <Button kind="primary" onClick={handleSubmitWizard}>Submit Application</Button>}
      </div>
    </Content>
  )
}


// Trade Ticket Modal Component
const TradeTicketModal = ({ isOpen, onClose, showToast, products }: {
  isOpen: boolean;
  onClose: () => void;
  showToast: (props: ToastProps) => void;
  products: ComboBoxItem[];
}) => {
  const [selectedProduct, setSelectedProduct] = useState<ComboBoxItem | null>(null);
  const [orderType, setOrderType] = useState<'Buy' | 'Sell' | ''>('Buy');
  const [quantity, setQuantity] = useState<string>('');
  const [price, setPrice] = useState<string>(''); // Optional
  const [suitability, setSuitability] = useState<{ kind: ToastProps['kind']; title: string; subtitle: string } | null>(null);

  const resetForm = () => {
    setSelectedProduct(null);
    setOrderType('Buy');
    setQuantity('');
    setPrice('');
    setSuitability(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  useEffect(() => { // Suitability Check
    if (selectedProduct && quantity) {
      const numQuantity = parseInt(quantity, 10);
      if (numQuantity <= 0) {
        setSuitability({ kind: 'error', title: 'Invalid Quantity', subtitle: 'Quantity must be greater than zero.' });
        return;
      }
      // Example Suitability Logic
      if (selectedProduct.risk === 'High' && numQuantity > 100) {
        setSuitability({ kind: 'warning', title: 'High Risk Trade', subtitle: `Trading ${numQuantity} of high-risk ${selectedProduct.text} may not be suitable.` });
      } else if (numQuantity > 1000) {
        setSuitability({ kind: 'info', title: 'Large Order Review', subtitle: `Order for ${numQuantity} units. Ensure client confirmation.` });
      } else {
        setSuitability({ kind: 'success', title: 'Trade Appears Suitable', subtitle: 'Basic checks passed.' });
      }
    } else {
      setSuitability(null);
    }
  }, [selectedProduct, quantity]);

  const handleSubmit = () => {
    if (!selectedProduct || !quantity || parseInt(quantity) <= 0 || !orderType) {
      showToast({ kind: 'error', title: 'Trade Error', subtitle: 'Please fill all required fields (Product, Order Type, Quantity > 0).', timeout: 4000 });
      return;
    }
    // Placeholder submission
    console.log('Trade Submitted:', { selectedProduct, orderType, quantity, price });
    showToast({ kind: 'success', title: 'Trade Submitted', subtitle: `Order for ${quantity} of ${selectedProduct.text} placed.`, timeout: 3000 });
    handleClose();
  };

  // Type assertion for NumberInput event
  const handleQuantityChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuantity(event.target.value);
  };
  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPrice(event.target.value);
  };


  return (
    <Modal
      open={isOpen}
      onRequestClose={handleClose}
      modalHeading="Trade Ticket"
      primaryButtonText="Submit Trade"
      secondaryButtonText="Cancel"
      onRequestSubmit={handleSubmit}
      onSecondarySubmit={handleClose}
      size="md" // Medium size modal
    >
      <FormGroup legendText="Product Information" style={{ marginBottom: '1rem' }}>
        <ComboBox
          id="product-combobox"
          titleText="Select Product/Symbol"
          placeholder="Search product or symbol"
          items={products}
          itemToString={(item) => (item ? item.text : '')}
          selectedItem={selectedProduct}
          onChange={({ selectedItem }) => setSelectedProduct(selectedItem || null)}
          shouldFilterItem={({ item, inputValue }) =>
            !inputValue || item.text.toLowerCase().includes(inputValue.toLowerCase())
          }
        />
      </FormGroup>
      <FormGroup legendText="Order Details" style={{ marginBottom: '1rem' }}>
        <Select id="orderType" labelText="Order Type" value={orderType} onChange={(e) => setOrderType(e.target.value as 'Buy' | 'Sell' | '')} style={{ marginBottom: '1rem' }}>
          <SelectItem value="Buy" text="Buy" />
          <SelectItem value="Sell" text="Sell" />
        </Select>
        <NumberInput
          id="quantity"
          name="quantity"
          label="Quantity"
          value={Number(quantity) || ''} // Ensure value is number or empty string for placeholder
          onChange={handleQuantityChange}
          min={1}
          invalidText="Quantity must be a positive number."
          style={{ marginBottom: '1rem' }}
        />
        <NumberInput
          id="price"
          name="price"
          label="Price (Optional - Market if blank)"
          value={Number(price) || ''}
          onChange={handlePriceChange}
          min={0}
          step={0.01}
          invalidText="Price must be a positive number."
          style={{ marginBottom: '1rem' }}
        />
      </FormGroup>
      {suitability && (
        <InlineNotification
          kind={suitability.kind}
          title={suitability.title}
          subtitle={suitability.subtitle}
          hideCloseButton
          lowContrast
          style={{ marginBottom: '1rem' }}
        />
      )}
    </Modal>
  );
};


const AppHeader = ({ onNewTradeClick }: { onNewTradeClick: () => void }) => (
  <Header aria-label="Complianced Platform Name">
    <SkipToContent />
    <HeaderName href="#" prefix="">
      Complianced
    </HeaderName>
    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
      <Select id="language-select" defaultValue="en" labelText="" inline size="sm" style={{ marginRight: '1rem' }}>
        <SelectItem value="en" text="EN" />
        <SelectItem value="fr" text="FR" />
      </Select>
      <HeaderGlobalAction aria-label="New Trade" onClick={onNewTradeClick}>
        <Trade20 />
      </HeaderGlobalAction>
    </div>
  </Header>
)

const AppSideNav = ({ onNavClick }: { onNavClick: (moduleName: string) => void }) => (
  <SideNav isFixedNav expanded={true} isChildOfHeader={false} aria-label="Side navigation">
    <SideNavItems>
      <SideNavLink onClick={() => onNavClick('Accounts')}>Accounts</SideNavLink>
      <SideNavLink onClick={() => onNavClick('KYC')}>KYC</SideNavLink>
      <SideNavLink onClick={() => onNavClick('KYP')}>KYP</SideNavLink>
      <SideNavLink onClick={() => onNavClick('ProductLibrary')}>Product Library</SideNavLink> {/* New Link */}
      <SideNavLink onClick={() => onNavClick('Trades')}>Trades</SideNavLink>
      <SideNavLink onClick={() => onNavClick('Documents')}>Documents</SideNavLink>
      <SideNavLink onClick={() => onNavClick('Audits')}>Audits</SideNavLink>
      <SideNavLink onClick={() => onNavClick('Dashboard')}>Dashboard</SideNavLink>
      <SideNavLink onClick={() => onNavClick('Settings')}>Settings</SideNavLink>
      <SideNavLink onClick={() => onNavClick('Help')}>Help</SideNavLink>
    </SideNavItems>
  </SideNav>
)

// Client KYC Form Component
const ClientKycForm = ({ showToast }: { showToast: (props: ToastProps) => void }) => {
  const initialFormData = {
    fullName: '',
    email: '',
    dob: '',
    addressStreet: '',
    addressCity: '',
    addressPostalCode: '',
    country: '',
    occupation: '',
    employmentStatus: '',
    income: '', // NumberInput handles string conversion
    assets: '',  // NumberInput handles string conversion
  }
  const initialValidationState = {
    fullName: { invalid: false, invalidText: '' },
    email: { invalid: false, invalidText: '' },
    dob: { invalid: false, invalidText: '' },
    // Add other fields as needed
  }

  const [formData, setFormData] = useState(initialFormData)
  const [formValidation, setFormValidation] = useState(initialValidationState)

  const validateField = (name: string, value: string): { invalid: boolean; invalidText: string } => {
    if (name === 'fullName') {
      if (!value) return { invalid: true, invalidText: 'Full name is required.' }
    }
    if (name === 'email') {
      if (!value) return { invalid: true, invalidText: 'Email is required.' }
      if (!/\S+@\S+\.\S+/.test(value)) return { invalid: true, invalidText: 'Email format is invalid.' }
    }
    if (name === 'dob') {
        if (!value) return { invalid: true, invalidText: 'Date of birth is required.'}
    }
    return { invalid: false, invalidText: '' }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (name === 'fullName' || name === 'email') {
        const validation = validateField(name, value)
        setFormValidation((prev) => ({ ...prev, [name]: validation }))
    }
  }

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement & { value: string }>, fieldName: string ) => {
    // NumberInput's event is different, value is directly on event for its structure
    // For Carbon v11, it might be `event.imaginaryTarget.value` or similar for direct value,
    // or you might get it through `event.target.value` if used as a controlled component.
    // Assuming event.target.value works for simplicity here based on typical controlled input.
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };


  const handleDobChangeKyc = (dates: Date[]) => {
    const value = dates && dates.length > 0 ? dates[0].toLocaleDateString() : ''
    setFormData((prev) => ({ ...prev, dob: value }))
    const validation = validateField('dob', value);
    setFormValidation((prev) => ({ ...prev, dob: validation }));
  }

  const handleSave = () => {
    // Trigger validation for all fields before saving
    let isValid = true;
    const newValidationState = { ...initialValidationState };
    (Object.keys(formData) as Array<keyof typeof formData>).forEach(key => {
        if (key === 'fullName' || key === 'email' || key === 'dob') { // only validate these for now
            const validation = validateField(key, formData[key] as string);
            newValidationState[key] = validation;
            if (validation.invalid) isValid = false;
        }
    });
    setFormValidation(newValidationState);

    if (isValid) {
      console.log('KYC Form Saved:', formData)
      showToast({ kind: 'success', title: 'KYC Data Saved', subtitle: 'Client information updated successfully.', timeout: 3000 })
    } else {
      showToast({ kind: 'error', title: 'Validation Error', subtitle: 'Please correct the errors in the form.', timeout: 3000 })
    }
  }

  const handleCancel = () => {
    setFormData(initialFormData)
    setFormValidation(initialValidationState)
    showToast({ kind: 'info', title: 'Cancelled', subtitle: 'KYC form changes were not saved.', timeout: 3000 })
  }

  return (
    <Content id="kyc-form-content" style={{ padding: '1rem' }}>
      <h2>Client KYC Form</h2>
      <Form style={{ marginTop: '1rem' }}>
        <FormGroup legendText="Personal Details" style={{ marginBottom: '1.5rem' }}>
          <TextInput
            id="fullName"
            name="fullName"
            labelText="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            invalid={formValidation.fullName.invalid}
            invalidText={formValidation.fullName.invalidText}
            style={{ marginBottom: '1rem' }}
            required
          />
          <TextInput
            id="email"
            name="email"
            type="email"
            labelText="Email Address"
            value={formData.email}
            onChange={handleChange}
            invalid={formValidation.email.invalid}
            invalidText={formValidation.email.invalidText}
            style={{ marginBottom: '1rem' }}
            required
          />
          <DatePicker datePickerType="single" onChange={handleDobChangeKyc} dateFormat="m/d/Y">
            <DatePickerInput
              id="dob"
              name="dob"
              placeholder="mm/dd/yyyy"
              labelText="Date of Birth"
              value={formData.dob} // Controlled component
              invalid={formValidation.dob.invalid}
              invalidText={formValidation.dob.invalidText}
              required
            />
          </DatePicker>
        </FormGroup>

        <FormGroup legendText="Address Information" style={{ marginBottom: '1.5rem' }}>
          <TextInput id="addressStreet" name="addressStreet" labelText="Street Address" value={formData.addressStreet} onChange={handleChange} style={{ marginBottom: '1rem' }} />
          <TextInput id="addressCity" name="addressCity" labelText="City" value={formData.addressCity} onChange={handleChange} style={{ marginBottom: '1rem' }} />
          <TextInput id="addressPostalCode" name="addressPostalCode" labelText="Postal Code" value={formData.addressPostalCode} onChange={handleChange} style={{ marginBottom: '1rem' }} />
          <Select id="country" name="country" labelText="Country" value={formData.country} onChange={handleChange} style={{ marginBottom: '1rem' }}>
            <SelectItem value="" text="Select a country" />
            <SelectItem value="USA" text="United States" />
            <SelectItem value="CAN" text="Canada" />
            <SelectItem value="GBR" text="United Kingdom" />
            {/* Add more countries as needed */}
          </Select>
        </FormGroup>

        <FormGroup legendText="Employment & Financials" style={{ marginBottom: '1.5rem' }}>
          <TextInput id="occupation" name="occupation" labelText="Occupation" value={formData.occupation} onChange={handleChange} style={{ marginBottom: '1rem' }} />
          <Select id="employmentStatus" name="employmentStatus" labelText="Employment Status" value={formData.employmentStatus} onChange={handleChange} style={{ marginBottom: '1rem' }}>
            <SelectItem value="" text="Select status" />
            <SelectItem value="employed" text="Employed" />
            <SelectItem value="unemployed" text="Unemployed" />
            <SelectItem value="self-employed" text="Self-Employed" />
            <SelectItem value="student" text="Student" />
            <SelectItem value="retired" text="Retired" />
          </Select>
          <NumberInput id="income" name="income" label="Annual Income (USD)" value={Number(formData.income) || 0} onChange={(e) => handleNumberChange(e as any, 'income')} style={{ marginBottom: '1rem' }} />
          <NumberInput id="assets" name="assets" label="Total Assets (USD)" value={Number(formData.assets) || 0} onChange={(e) => handleNumberChange(e as any, 'assets')} style={{ marginBottom: '1rem' }} />
        </FormGroup>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', borderTop: '1px solid #e0e0e0', paddingTop: '1rem' }}>
          <Button kind="secondary" style={{ marginRight: '1rem' }} onClick={handleCancel}>Cancel</Button>
          <Button kind="primary" onClick={handleSave}>Save KYC Data</Button>
        </div>
      </Form>
    </Content>
  )
}


// Risk Profile Questionnaire Component
const RiskProfileQuestionnaire = ({ showToast }: { showToast: (props: ToastProps) => void }) => {
  const initialAnswers = {
    q1InvestmentExperience: '',
    q2RiskTolerance: '',
    q3LossComfort: 50, // Default slider value
    q4LiquidityNeeds: '',
  };

  const [answers, setAnswers] = useState(initialAnswers);
  const [riskScore, setRiskScore] = useState(0);
  const [riskProfile, setRiskProfile] = useState('Low');
  const [tableData, setTableData] = useState<Array<{id: string, question: string, answer: string | number}>>([]);

  const questionsConfig = [
    { id: 'q1InvestmentExperience', text: 'Investment Experience:', type: 'radio', options: ['Novice', 'Intermediate', 'Advanced'], scores: { Novice: 1, Intermediate: 2, Advanced: 3 } },
    { id: 'q2RiskTolerance', text: 'General Risk Tolerance:', type: 'radio', options: ['Low', 'Medium', 'High'], scores: { Low: 1, Medium: 2, High: 3 } },
    { id: 'q3LossComfort', text: 'Comfort with Potential Loss (0-100%):', type: 'slider', min: 0, max: 100, step: 1, scoreMapping: (val: number) => (val <= 30 ? 1 : (val <= 70 ? 2 : 3)) },
    { id: 'q4LiquidityNeeds', text: 'Liquidity Needs (Access to funds):', type: 'radio', options: ['High (Short-term)', 'Medium (Mid-term)', 'Low (Long-term)'], scores: {'High (Short-term)': 1, 'Medium (Mid-term)': 2, 'Low (Long-term)': 3} }
  ];

  useEffect(() => {
    let currentScore = 0;
    const newTableData = [];

    const q1Answer = answers.q1InvestmentExperience;
    if (q1Answer) currentScore += questionsConfig[0].scores[q1Answer] || 0;
    newTableData.push({ id: 'q1', question: questionsConfig[0].text, answer: q1Answer });

    const q2Answer = answers.q2RiskTolerance;
    if (q2Answer) currentScore += questionsConfig[1].scores[q2Answer] || 0;
    newTableData.push({ id: 'q2', question: questionsConfig[1].text, answer: q2Answer });

    currentScore += questionsConfig[2].scoreMapping(answers.q3LossComfort);
    newTableData.push({ id: 'q3', question: questionsConfig[2].text, answer: answers.q3LossComfort });

    const q4Answer = answers.q4LiquidityNeeds;
    if (q4Answer) currentScore += questionsConfig[3].scores[q4Answer] || 0;
    newTableData.push({ id: 'q4', question: questionsConfig[3].text, answer: q4Answer });

    setRiskScore(currentScore);

    if (currentScore <= 4) setRiskProfile('Low');
    else if (currentScore <= 8) setRiskProfile('Medium');
    else setRiskProfile('High');

    setTableData(newTableData.map(item => ({...item, answer: String(item.answer)}))); // Ensure answer is string for DataTable

  }, [answers]); // questionsConfig can be added if it's dynamic, but here it's constant.

  const handleRadioChange = (value: string, name: string) => {
    setAnswers(prev => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = ({ value }: { value: number }) => {
    setAnswers(prev => ({ ...prev, q3LossComfort: value }));
  };

  const getRiskProfileTagType = (profile: string) : "green" | "blue" | "red" | "gray" => {
    if (profile === 'Low') return 'green';
    if (profile === 'Medium') return 'blue'; // Using blue for medium as an example
    if (profile === 'High') return 'red';
    return 'gray';
  };

  const tableHeaders = [
    { key: 'question', header: 'Question' },
    { key: 'answer', header: 'Selected Answer' },
  ];

  const handleSave = () => {
    console.log('Risk Profile Saved:', { answers, riskScore, riskProfile });
    showToast({ kind: 'success', title: 'Risk Profile Saved', subtitle: 'Questionnaire data has been saved.', timeout: 3000 });
  };

  const handleCancel = () => {
    setAnswers(initialAnswers);
    // Score and profile will auto-update via useEffect
    showToast({ kind: 'info', title: 'Cancelled', subtitle: 'Risk profile changes were not saved.', timeout: 3000 });
  };

  return (
    <Content id="risk-questionnaire-content" style={{ padding: '1rem' }}>
      <h2>Risk Profile Questionnaire</h2>
      <Form style={{ marginTop: '1rem', marginBottom: '2rem' }}>
        <FormGroup legendText={questionsConfig[0].text}>
          <RadioButtonGroup
            name="q1InvestmentExperience"
            orientation="vertical"
            valueSelected={answers.q1InvestmentExperience}
            onChange={handleRadioChange}
          >
            {questionsConfig[0].options.map(opt => <RadioButton key={opt} labelText={opt} value={opt} />)}
          </RadioButtonGroup>
        </FormGroup>
        <FormGroup legendText={questionsConfig[1].text} style={{ marginTop: '1.5rem' }}>
          <RadioButtonGroup
            name="q2RiskTolerance"
            orientation="vertical"
            valueSelected={answers.q2RiskTolerance}
            onChange={handleRadioChange}
          >
            {questionsConfig[1].options.map(opt => <RadioButton key={opt} labelText={opt} value={opt} />)}
          </RadioButtonGroup>
        </FormGroup>
        <FormGroup legendText={questionsConfig[2].text} style={{ marginTop: '1.5rem' }}>
          <Slider
            id="q3LossComfort"
            name="q3LossComfort"
            labelText="" // Legend text from FormGroup is enough
            value={answers.q3LossComfort}
            min={questionsConfig[2].min}
            max={questionsConfig[2].max}
            step={questionsConfig[2].step}
            onChange={handleSliderChange}
          />
        </FormGroup>
        <FormGroup legendText={questionsConfig[3].text} style={{ marginTop: '1.5rem' }}>
          <RadioButtonGroup
            name="q4LiquidityNeeds"
            orientation="vertical"
            valueSelected={answers.q4LiquidityNeeds}
            onChange={handleRadioChange}
          >
            {questionsConfig[3].options.map(opt => <RadioButton key={opt} labelText={opt} value={opt} />)}
          </RadioButtonGroup>
        </FormGroup>
      </Form>

      <div style={{ marginBottom: '2rem' }}>
        <h4>Current Risk Profile: <Tag type={getRiskProfileTagType(riskProfile)}>{riskProfile}</Tag> (Score: {riskScore})</h4>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h4>Summary of Answers:</h4>
        <DataTable rows={tableData} headers={tableHeaders} isSortable={false}>
          {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
            <TableContainer>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHeader {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow {...getRowProps({ row })}>
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', borderTop: '1px solid #e0e0e0', paddingTop: '1rem' }}>
        <Button kind="secondary" style={{ marginRight: '1rem' }} onClick={handleCancel}>Cancel</Button>
        <Button kind="primary" onClick={handleSave}>Save Profile</Button>
      </div>
    </Content>
  );
};


// Product KYP Library Component
const ProductKypLibrary = () => {
  const placeholderProducts: Array<Product & { name: string, symbol: string, details: string }> = Array.from({ length: 25 }, (_, i) => ({
    id: `prod-${i + 1}`,
    text: `Product ${(i + 1).toString().padStart(2, '0')} (P${(i + 1).toString().padStart(2, '0')})`, // For ComboBox
    name: `Product ${(i + 1).toString().padStart(2, '0')}`, // For DataTable
    symbol: `P${(i + 1).toString().padStart(2, '0')}`, // For DataTable
    category: (['Stocks', 'Bonds', 'ETFs', 'Mutual Funds', 'Alternatives'] as Product['category'][])[i % 5],
    riskLevel: (['Low', 'Medium', 'High'] as Product['riskLevel'][])[i % 3],
    details: `Detailed information about Product ${i + 1}. This product is suitable for investors looking for ${(['capital appreciation', 'stable income', 'diversification', 'aggressive growth', 'hedging strategies'] as string[])[i % 5]}. It belongs to the ${(i % 5 === 0 ? 'equity' : i % 5 === 1 ? 'fixed income' : 'alternative investment')} asset class.`,
  }));

  const [allProducts] = useState<Array<Product & { name: string, symbol: string, details: string }>>(placeholderProducts);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>(allProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(''); // Empty for 'All'
  const [riskFilter, setRiskFilter] = useState(''); // Empty for 'All'

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [isQuickViewModalOpen, setIsQuickViewModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    let filtered = allProducts;
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (categoryFilter) {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }
    if (riskFilter) {
      filtered = filtered.filter(p => p.riskLevel === riskFilter);
    }
    setDisplayedProducts(filtered);
    setCurrentPage(1); // Reset to first page on filter/search change
  }, [allProducts, searchQuery, categoryFilter, riskFilter]);

  const paginatedProducts = displayedProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  const handleCategoryFilterChange = (item: { selectedItem?: string }) => {
    setCategoryFilter(item.selectedItem || '');
  };
  const handleRiskFilterChange = (item: { selectedItem?: string }) => {
    setRiskFilter(item.selectedItem || '');
  };
  const handlePaginationChange = (e: { page: number, pageSize: number }) => {
    setCurrentPage(e.page);
    setPageSize(e.pageSize);
  };
  const openQuickViewModal = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewModalOpen(true);
  };
  const closeQuickViewModal = () => setIsQuickViewModalOpen(false);

  const categories = ['All Categories', 'Stocks', 'Bonds', 'ETFs', 'Mutual Funds', 'Alternatives'];
  const riskLevels = ['All Risk Levels', 'Low', 'Medium', 'High'];

  const headers = [
    { key: 'name', header: 'Product Name' },
    { key: 'symbol', header: 'Symbol' },
    { key: 'category', header: 'Category' },
    { key: 'riskLevel', header: 'Risk Level' },
    { key: 'actions', header: 'Actions' },
  ];

  const rows = paginatedProducts.map(product => ({
    id: product.id,
    name: product.name,
    symbol: product.symbol,
    category: product.category,
    riskLevel: product.riskLevel,
    actions: <Button size="sm" kind="ghost" onClick={() => openQuickViewModal(product)}>Quick View</Button>,
  }));

  return (
    <Content id="product-library-content" style={{ padding: '1rem' }}>
      <h2>Product (KYP) Library</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', gap: '1rem', flexWrap: 'wrap' }}>
        <Search labelText="Search products" placeholder="Search by name or symbol" value={searchQuery} onChange={handleSearchChange} style={{ minWidth: '300px' }} />
        <Dropdown
          id="category-filter"
          label="Filter by category"
          items={categories.map(c => ({ id: c, text: c }))}
          selectedItem={categoryFilter || categories[0]}
          onChange={handleCategoryFilterChange}
          itemToString={(item) => (item ? item.text : '')}
          style={{ minWidth: '200px' }}
        />
        <Dropdown
          id="risk-filter"
          label="Filter by risk level"
          items={riskLevels.map(r => ({ id: r, text: r }))}
          selectedItem={riskFilter || riskLevels[0]}
          onChange={handleRiskFilterChange}
          itemToString={(item) => (item ? item.text : '')}
          style={{ minWidth: '200px' }}
        />
      </div>

      <DataTable rows={rows} headers={headers} isSortable={false}>
        {({ rows: dataTableRows, headers: dataTableHeaders, getTableProps, getHeaderProps, getRowProps }) => (
          <TableContainer>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {dataTableHeaders.map((header) => (
                    <TableHeader {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {dataTableRows.map((row) => (
                  <TableRow {...getRowProps({ row })}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
      <Pagination
        totalItems={displayedProducts.length}
        pageSize={pageSize}
        pageSizes={[5, 10, 20]}
        page={currentPage}
        onChange={handlePaginationChange}
        style={{ marginTop: '1rem' }}
      />

      {quickViewProduct && (
        <Modal
          open={isQuickViewModalOpen}
          onRequestClose={closeQuickViewModal}
          modalHeading={`Quick View: ${quickViewProduct.name} (${quickViewProduct.symbol})`}
          passiveModal // No need for primary/secondary buttons for a view
          size="lg" // Larger modal for more details
        >
          <p><strong>Category:</strong> {quickViewProduct.category}</p>
          <p><strong>Risk Level:</strong> {quickViewProduct.riskLevel}</p>
          <p style={{ marginTop: '1rem' }}><strong>Details:</strong></p>
          <p>{quickViewProduct.details}</p>
        </Modal>
      )}
    </Content>
  );
};


// Real-time Trade Blotter Component
const TradeBlotter = ({ showToast }: { showToast: (props: ToastProps) => void }) => {
  const initialTrades: Trade[] = [
    { id: 't1', timestamp: new Date(Date.now() - 50000), symbol: 'ABC', orderType: 'Buy', quantity: 100, price: 150.25, status: 'Executed', aiFlags: [] },
    { id: 't2', timestamp: new Date(Date.now() - 30000), symbol: 'XYZ', orderType: 'Sell', quantity: 200, price: 75.50, status: 'Pending', aiFlags: [{ type: 'warning', message: 'Unusual volume' }] },
    { id: 't3', timestamp: new Date(Date.now() - 10000), symbol: 'MegaCorp', orderType: 'Buy', quantity: 1500, price: 300.00, status: 'Flagged', aiFlags: [{ type: 'error', message: 'Exceeds limit' }, {type: 'info', message: 'Review required'}] },
  ];

  const [trades, setTrades] = useState<Trade[]>(initialTrades);
  const [sortHeaderKey, setSortHeaderKey] = useState<string>('timestamp');
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC');

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newTrade: Trade = {
        id: `trade-${Date.now()}`,
        timestamp: new Date(),
        symbol: ['AAPL', 'GOOG', 'MSFT', 'TSLA', 'AMZN'][Math.floor(Math.random() * 5)],
        orderType: Math.random() > 0.5 ? 'Buy' : 'Sell',
        quantity: Math.floor(Math.random() * 1000) + 1,
        price: parseFloat((Math.random() * 500 + 10).toFixed(2)),
        status: ['Pending', 'Executed', 'Flagged'][Math.floor(Math.random() * 3)] as Trade['status'],
        aiFlags: [],
      };
      if (newTrade.quantity > 800) {
        newTrade.aiFlags.push({ type: 'warning', message: 'Large quantity' });
      }
      if (newTrade.symbol === 'TSLA' && newTrade.orderType === 'Sell') {
        newTrade.aiFlags.push({ type: 'info', message: 'Insider selling protocol' });
      }
      if (newTrade.status === 'Flagged') {
         newTrade.aiFlags.push({ type: 'error', message: 'Compliance review needed' });
      }
      setTrades(currentTrades => [newTrade, ...currentTrades.slice(0, 49)]); // Keep max 50 trades
    }, 5000); // Add new trade every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  const handleSort = (headerKey: string) => {
    if (sortHeaderKey === headerKey) {
      setSortDirection(prev => (prev === 'ASC' ? 'DESC' : 'ASC'));
    } else {
      setSortHeaderKey(headerKey);
      setSortDirection('ASC');
    }
  };

  const sortedTrades = [...trades].sort((a, b) => {
    if (!sortHeaderKey) return 0;
    const valA = a[sortHeaderKey as keyof Trade];
    const valB = b[sortHeaderKey as keyof Trade];

    if (valA < valB) return sortDirection === 'ASC' ? -1 : 1;
    if (valA > valB) return sortDirection === 'ASC' ? 1 : -1;
    return 0;
  });

  const headers = [
    { key: 'timestamp', header: 'Timestamp', isSortable: true },
    { key: 'symbol', header: 'Symbol', isSortable: true },
    { key: 'orderType', header: 'Order Type' },
    { key: 'quantity', header: 'Quantity' },
    { key: 'price', header: 'Price' },
    { key: 'status', header: 'Status', isSortable: true },
    { key: 'aiFlags', header: 'AI Flags' },
    { key: 'actions', header: 'Actions' },
  ];

  const rows = sortedTrades.map(trade => ({
    id: trade.id,
    timestamp: trade.timestamp.toLocaleString(),
    symbol: trade.symbol,
    orderType: trade.orderType,
    quantity: trade.quantity,
    price: trade.price.toFixed(2),
    status: trade.status,
    aiFlags: (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
        {trade.aiFlags.map((flag, index) => (
          <Tag key={index} type={flag.type === 'error' ? 'red' : flag.type === 'warning' ? 'orange' : 'blue'}>
            {flag.message}
          </Tag>
        ))}
      </div>
    ),
    actions: (
      <OverflowMenu flipped size="sm" light> {/* Added light prop for better visibility on default bg */}
        <OverflowMenuItem itemText="View Details" renderIcon={View16} onClick={() => showToast({ kind: 'info', title: 'Details', subtitle: `Viewing details for trade ${trade.id}`, timeout: 2000})} />
        <OverflowMenuItem itemText="Cancel Trade" renderIcon={TrashCan16} disabled={trade.status !== 'Pending'} onClick={() => showToast({ kind: 'info', title: 'Cancel', subtitle: `Attempting to cancel trade ${trade.id}`, timeout: 2000})} />
      </OverflowMenu>
    ),
  }));

  return (
    <Content id="trade-blotter-content" style={{ padding: '1rem' }}>
      <h2>Real-time Trade Blotter</h2>
      <DataTable rows={rows} headers={headers.map(h => ({ ...h, isSortable: h.isSortable || false }))} isSortable>
        {({ rows: dataTableRows, headers: dataTableHeaders, getTableProps, getHeaderProps, getRowProps, getSortHeaderProps }) => (
          <TableContainer>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {dataTableHeaders.map((header) => (
                    <TableHeader
                      key={header.key}
                      {...getSortHeaderProps({ header, isSortable: header.isSortable })}
                      onClick={() => header.isSortable && handleSort(header.key)}
                    >
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {dataTableRows.map((row) => (
                  <TableRow {...getRowProps({ row })}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
    </Content>
  );
};


const AppContent = ({ activeModule, onSetupMfaClick }: { activeModule: string | null; onSetupMfaClick: () => void }) => (
  <Content id="main-content" style={{ padding: '1rem' }}>
    <h2>{activeModule || 'Dashboard'} Content Placeholder</h2>
    <p>This is where the main application content for {activeModule || 'the dashboard'} will go.</p>
    {activeModule !== 'Accounts' && activeModule !== 'KYC' && activeModule !== 'KYP' && activeModule !== 'ProductLibrary' && activeModule !== 'Trades' && <Button onClick={onSetupMfaClick} style={{ marginTop: '1rem' }}>Setup MFA</Button>}
  </Content>
)

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showMfaModal, setShowMfaModal] = useState(false)
  const [toastNotificationProps, setToastNotificationProps] = useState<ToastProps | null>(null)
  const [activeModule, setActiveModule] = useState<string | null>('Dashboard') // Default to Dashboard
  const [isTradeTicketModalOpen, setIsTradeTicketModalOpen] = useState(false);

  // Sample products for Trade Ticket ComboBox
  const tradeableProducts: ComboBoxItem[] = [
    { id: 'P01', text: 'Alpha Corp (ALP)', risk: 'Medium' },
    { id: 'P02', text: 'Beta Inc (BET)', risk: 'High' },
    { id: 'P03', text: 'Gamma Ltd (GAM)', risk: 'Low' },
    { id: 'P04', text: 'Delta Co (DEL)', risk: 'Medium' },
    { id: 'P05', text: 'Epsilon PLC (EPS)', risk: 'High' },
  ];


  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
    setActiveModule('Dashboard') // Set default module on login
  }

  const handleMfaModalOpen = () => {
    setShowMfaModal(true)
  }
  const handleMfaModalClose = () => {
    setShowMfaModal(false)
  }

  const openTradeTicketModal = () => setIsTradeTicketModalOpen(true);
  const closeTradeTicketModal = () => setIsTradeTicketModalOpen(false);


  const showToast = (props: ToastProps) => {
    setToastNotificationProps(props)
  }
  const dismissToast = () => {
    setToastNotificationProps(null)
  }

  const handleNavClick = (moduleName: string) => {
    setActiveModule(moduleName)
  }

  return (
    <>
      {toastNotificationProps && (
        <ToastNotification
          {...toastNotificationProps}
          onCloseButtonClick={dismissToast}
          style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 9999 }}
        />
      )}

      {!isAuthenticated ? (
        <LoginForm onLoginSuccess={handleLoginSuccess} showToast={showToast} />
      ) : (
        <>
          <AppHeader onNewTradeClick={openTradeTicketModal} />
          <AppSideNav onNavClick={handleNavClick} />
          {activeModule === 'Accounts' ? (
            <AccountOpeningWizard showToast={showToast} />
          ) : activeModule === 'KYC' ? (
            <ClientKycForm showToast={showToast} />
          ) : activeModule === 'KYP' ? (
            <RiskProfileQuestionnaire showToast={showToast} />
          ) : activeModule === 'ProductLibrary' ? (
            <ProductKypLibrary />
          ) : activeModule === 'Trades' ? (
            <TradeBlotter showToast={showToast} />
          ) : (
            <AppContent activeModule={activeModule} onSetupMfaClick={handleMfaModalOpen} />
          )}
          <MfaSetupModal isOpen={showMfaModal} onClose={handleMfaModalClose} showToast={showToast} />
          <TradeTicketModal
            isOpen={isTradeTicketModalOpen}
            onClose={closeTradeTicketModal}
            showToast={showToast}
            products={tradeableProducts}
          />
        </>
      )}
    </>
  )
}

export default App
