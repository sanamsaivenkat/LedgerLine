
import { useState } from 'react'
import {
  LayoutDashboard, Wallet, ArrowLeftRight, ReceiptText,
  Settings, HelpCircle, Bell, Search, Plus, ArrowUpRight,
  ArrowDownLeft, CreditCard, MoreHorizontal, 
  Menu, X, Eye, EyeOff
} from 'lucide-react'
import './App.css'

const transactions = [
  { id: 1, name: 'Grocery Store', category: 'Shopping', date: 'Today, 10:42 AM', amount: -1250, type: 'expense', icon: '🛒' },
  { id: 2, name: 'Salary Credit', category: 'Income', date: 'Today, 09:15 AM', amount: 35000, type: 'income', icon: '💰' },
  { id: 3, name: 'Electricity Bill', category: 'Utilities', date: 'Yesterday', amount: -1850, type: 'expense', icon: '⚡' },
  { id: 4, name: 'Online Shopping', category: 'Shopping', date: '10 Nov 2026', amount: -2499, type: 'expense', icon: '🛍️' },
]

function App() {
  const [activePage, setActivePage] = useState('Overview')
  const [showBalance, setShowBalance] = useState(true)
  const [mobileMenu, setMobileMenu] = useState(false)

  const navigation = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'My Accounts', icon: Wallet },
    { name: 'Transfers', icon: ArrowLeftRight },
    { name: 'Transactions', icon: ReceiptText },
  ]

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount)

  const selectPage = (page) => {
    setActivePage(page)
    setMobileMenu(false)
  }

  return (
    <div className="app-shell">
      {mobileMenu && <div className="mobile-overlay" onClick={() => setMobileMenu(false)} />}

      <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-icon"><Wallet size={23} /></div>
          <span>Ledger<span className="brand-light">Line</span></span>
          <button className="mobile-close" onClick={() => setMobileMenu(false)}><X /></button>
        </div>

        <div className="sidebar-label">WORKSPACE</div>
        <nav className="navigation">
          {navigation.map(({ name, icon: Icon }) => (
            <button
              key={name}
              className={`nav-item ${activePage === name ? 'active' : ''}`}
              onClick={() => selectPage(name)}
            >
              <Icon size={19} />
              <span>{name}</span>
              {name === 'Transactions' && <span className="nav-count">4</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-label settings-label">PREFERENCES</div>
        <nav className="navigation">
          <button className={`nav-item ${activePage === 'Settings' ? 'active' : ''}`} onClick={() => selectPage('Settings')}>
            <Settings size={19} /><span>Settings</span>
          </button>
          <button className={`nav-item ${activePage === 'Help & Support' ? 'active' : ''}`} onClick={() => selectPage('Help & Support')}>
            <HelpCircle size={19} /><span>Help & Support</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="support-card">
            <div className="support-icon"><HelpCircle size={19} /></div>
            <strong>Need some help?</strong>
            <p>We're here whenever you need us.</p>
            <button onClick={() => selectPage('Help & Support')}>Get support <ArrowUpRight size={14} /></button>
          </div>
          <button className="profile">
            <div className="avatar">SV</div>
            <div className="profile-info">
              <strong>LedgerLine User</strong>
              <span>Personal Account</span>
            </div>
            <MoreHorizontal size={20} />
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="mobile-menu" onClick={() => setMobileMenu(true)}><Menu /></button>
            <div className="breadcrumb">Workspace <span>/</span> <strong>{activePage}</strong></div>
          </div>
          <div className="topbar-right">
            <div className="search-box">
              <Search size={17} />
              <input placeholder="Search anything..." />
              <kbd>⌘ K</kbd>
            </div>
            <button className="notification-button" aria-label="Notifications"><Bell size={19} /><i /></button>
            <div className="top-avatar">SV</div>
          </div>
        </header>

        {activePage === 'Overview' ? (
          <div className="dashboard">
            <section className="welcome-row">
              <div>
                <div className="eyebrow">THURSDAY, NOVEMBER 12, 2026</div>
                <h1>Welcome back, <span>there!</span> 👋</h1>
                <p>Here's what's happening with your finances today.</p>
              </div>
              <button className="primary-button" onClick={() => selectPage('My Accounts')}>
                <Plus size={18} /> New Account
              </button>
            </section>

            <section className="balance-grid">
              <div className="balance-card">
                <div className="card-top">
                  <span>Total balance</span>
                  <button className="visibility-button" onClick={() => setShowBalance(!showBalance)}>
                    {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                <div className="balance-amount">{showBalance ? '₹ 33,400.00' : '₹ ••••••••'}</div>
                <div className="balance-footer">
                  <span><i className="status-dot" /> All accounts</span>
                  <span className="balance-change"><ArrowUpRight size={15} /> Demo data</span>
                </div>
                <div className="card-decoration decoration-one" />
                <div className="card-decoration decoration-two" />
              </div>

              <div className="stat-card">
                <div className="stat-heading"><span>Income</span><div className="stat-icon income-icon"><ArrowDownLeft size={19} /></div></div>
                <div className="stat-amount">{showBalance ? '₹ 35,000.00' : '₹ ••••••••'}</div>
                <div className="stat-note"><span className="positive">↑ 12.8%</span> <span>vs last month</span></div>
                <div className="mini-bars income-bars"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
              </div>

              <div className="stat-card">
                <div className="stat-heading"><span>Expenses</span><div className="stat-icon expense-icon"><ArrowUpRight size={19} /></div></div>
                <div className="stat-amount">{showBalance ? '₹ 5,599.00' : '₹ ••••••••'}</div>
                <div className="stat-note"><span className="negative">↓ 4.2%</span> <span>vs last month</span></div>
                <div className="mini-bars expense-bars"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
              </div>
            </section>

            <section className="content-grid">
              <div className="panel accounts-panel">
                <div className="panel-heading">
                  <div><h2>My accounts</h2><p>Manage your bank accounts</p></div>
                  <button className="text-button" onClick={() => selectPage('My Accounts')}>View all <ArrowUpRight size={15} /></button>
                </div>
                <div className="bank-card">
                  <div className="bank-card-top">
                    <div className="bank-card-brand"><div className="tiny-brand"><Wallet size={17} /></div> LedgerLine</div>
                    <span className="account-status"><i /> Active</span>
                  </div>
                  <div className="bank-card-label">AVAILABLE BALANCE</div>
                  <div className="bank-card-balance">{showBalance ? '₹ 33,400.00' : '₹ ••••••••'}</div>
                  <div className="bank-card-bottom">
                    <div><span>ACCOUNT HOLDER</span><strong>LedgerLine User</strong></div>
                    <div><span>ACCOUNT NUMBER</span><strong>•••• •••• 0259</strong></div>
                    <CreditCard className="card-chip" size={27} />
                  </div>
                </div>
                <button className="add-account" onClick={() => selectPage('My Accounts')}><Plus size={18} /> Add another account</button>
              </div>

              <div className="panel quick-panel">
                <div className="panel-heading"><div><h2>Quick actions</h2><p>What would you like to do?</p></div></div>
                <div className="quick-actions">
                  <button onClick={() => selectPage('Transfers')}><div className="quick-icon transfer-quick"><ArrowLeftRight /></div><strong>Transfer</strong><span>Send money</span></button>
                  <button onClick={() => selectPage('My Accounts')}><div className="quick-icon deposit-quick"><ArrowDownLeft /></div><strong>Deposit</strong><span>Add money</span></button>
                  <button onClick={() => selectPage('Transactions')}><div className="quick-icon history-quick"><ReceiptText /></div><strong>History</strong><span>View activity</span></button>
                  <button onClick={() => selectPage('Settings')}><div className="quick-icon settings-quick"><Settings /></div><strong>Settings</strong><span>Preferences</span></button>
                </div>
                <div className="security-note"><div><span className="security-check">✓</span></div><p><strong>Your security matters</strong><br />Your banking experience is protected with secure access.</p></div>
              </div>
            </section>

            <section className="panel transactions-panel">
              <div className="panel-heading">
                <div><h2>Recent transactions</h2><p>Your latest account activity</p></div>
                <button className="text-button" onClick={() => selectPage('Transactions')}>See all transactions <ArrowUpRight size={15} /></button>
              </div>
              <div className="transaction-table">
                <div className="table-header"><span>TRANSACTION</span><span>CATEGORY</span><span>DATE</span><span>AMOUNT</span><span>STATUS</span></div>
                {transactions.map((tx) => (
                  <div className="transaction-row" key={tx.id}>
                    <div className="transaction-name"><div className="transaction-emoji">{tx.icon}</div><strong>{tx.name}</strong></div>
                    <span className="transaction-category">{tx.category}</span>
                    <span className="transaction-date">{tx.date}</span>
                    <strong className={tx.type === 'income' ? 'amount-income' : 'amount-expense'}>{tx.type === 'income' ? '+' : '−'}{formatCurrency(Math.abs(tx.amount))}</strong>
                    <span className="completed-badge"><i /> Completed</span>
                  </div>
                ))}
              </div>
            </section>

            <footer className="dashboard-footer">
              <span>© 2026 LedgerLine. All rights reserved.</span>
              <span>Secure banking experience <span className="footer-dot">•</span> Built with care.</span>
            </footer>
          </div>
        ) : (
          <div className="placeholder-page">
            <div className="placeholder-icon"><Wallet size={30} /></div>
            <h1>{activePage}</h1>
            <p>This section is part of the LedgerLine development roadmap.</p>
            <button className="primary-button" onClick={() => selectPage('Overview')}>Back to overview</button>
          </div>
        )}
      </main>
    </div>
  )
}

export default App