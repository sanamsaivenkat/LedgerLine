
import { useCallback, useEffect, useState } from 'react'
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  ReceiptText,
  Settings,
  HelpCircle,
  Bell,
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Menu,
  X,
  Eye,
  EyeOff,
  LogOut,
  RefreshCw,
} from 'lucide-react'

import Auth from './Auth'
import { authApi, accountApi, transactionApi } from './api'
import './App.css'

function App() {
  const [activePage, setActivePage] = useState('Overview')
  const [showBalance, setShowBalance] = useState(true)
  const [mobileMenu, setMobileMenu] = useState(false)

  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(sessionStorage.getItem('ledgerline_token'))
  )

  const [userEmail, setUserEmail] = useState('')
  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState('')

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
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount || 0))

  const formatDate = (date) => {
    if (!date) return 'Date unavailable'

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
      return 'Date unavailable'
    }

    return parsedDate.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const totalBalance = accounts.reduce(
    (total, account) => total + Number(account.balance || 0),
    0
  )

  const totalDeposits = transactions
    .filter((tx) => tx.transactionType === 'DEPOSIT')
    .reduce((total, tx) => total + Number(tx.amount || 0), 0)

  const totalWithdrawals = transactions
    .filter((tx) => tx.transactionType === 'WITHDRAWAL')
    .reduce((total, tx) => total + Number(tx.amount || 0), 0)

  const maskedBalance = '₹ ••••••••'

  const selectPage = (page) => {
    setActivePage(page)
    setMobileMenu(false)
  }

  const loadDashboardData = useCallback(async () => {
    setLoading(true)
    setLoadError('')

    try {
      const accountData = await accountApi.getAccounts()
      const accountList = Array.isArray(accountData) ? accountData : []

      setAccounts(accountList)

      const transactionResults = await Promise.allSettled(
        accountList.map((account) =>
          transactionApi.getTransactions(account.id)
        )
      )

      const allTransactions = transactionResults.flatMap((result) => {
        if (
          result.status !== 'fulfilled' ||
          !Array.isArray(result.value)
        ) {
          return []
        }

        return result.value
      })

      allTransactions.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )

      setTransactions(allTransactions)
    } catch (error) {
      setLoadError(
        error.message || 'Unable to load your banking information.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return

    const timer = setTimeout(() => {
      loadDashboardData()
    }, 0)

    return () => clearTimeout(timer)
  }, [isAuthenticated, loadDashboardData])

  const handleLogin = (result) => {
    setUserEmail(result.email || '')
    setIsAuthenticated(true)
    setActivePage('Overview')
  }

  const handleLogout = () => {
    authApi.logout()
    setIsAuthenticated(false)
    setUserEmail('')
    setAccounts([])
    setTransactions([])
    setLoadError('')
    setActivePage('Overview')
  }

  const renderTransactionRows = (items) => {
    if (items.length === 0) {
      return (
        <div className="empty-state">
          <ReceiptText size={30} />
          <strong>No transactions yet</strong>
          <p>Your account activity will appear here.</p>
        </div>
      )
    }

    return items.map((tx) => {
      const isDeposit = tx.transactionType === 'DEPOSIT'

      return (
        <div className="transaction-row" key={tx.id}>
          <div className="transaction-name">
            <div
              className={`transaction-emoji ${
                isDeposit ? 'income-icon' : 'expense-icon'
              }`}
            >
              {isDeposit ? (
                <ArrowDownLeft size={18} />
              ) : (
                <ArrowUpRight size={18} />
              )}
            </div>

            <strong>{isDeposit ? 'Deposit' : 'Withdrawal'}</strong>
          </div>

          <span className="transaction-category">
            {tx.transactionType}
          </span>

          <span className="transaction-date">
            {formatDate(tx.createdAt)}
          </span>

          <strong
            className={isDeposit ? 'amount-income' : 'amount-expense'}
          >
            {isDeposit ? '+' : '−'}
            {formatCurrency(tx.amount)}
          </strong>

          <span className="completed-badge">
            <i /> Recorded
          </span>
        </div>
      )
    })
  }

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />
  }

  return (
    <div className="app-shell">
      {mobileMenu && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-icon">
            <Wallet size={23} />
          </div>

          <span>
            Ledger<span className="brand-light">Line</span>
          </span>

          <button
            className="mobile-close"
            onClick={() => setMobileMenu(false)}
            aria-label="Close menu"
          >
            <X />
          </button>
        </div>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="navigation">
          {navigation.map(({ name, icon: Icon }) => (
            <button
              key={name}
              className={`nav-item ${
                activePage === name ? 'active' : ''
              }`}
              onClick={() => selectPage(name)}
            >
              <Icon size={19} />
              <span>{name}</span>

              {name === 'Transactions' && (
                <span className="nav-count">
                  {transactions.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-label settings-label">
          PREFERENCES
        </div>

        <nav className="navigation">
          <button
            className={`nav-item ${
              activePage === 'Settings' ? 'active' : ''
            }`}
            onClick={() => selectPage('Settings')}
          >
            <Settings size={19} />
            <span>Settings</span>
          </button>

          <button
            className={`nav-item ${
              activePage === 'Help & Support' ? 'active' : ''
            }`}
            onClick={() => selectPage('Help & Support')}
          >
            <HelpCircle size={19} />
            <span>Help & Support</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="support-card">
            <div className="support-icon">
              <HelpCircle size={19} />
            </div>

            <strong>Need some help?</strong>
            <p>We're here whenever you need us.</p>

            <button onClick={() => selectPage('Help & Support')}>
              Get support <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="profile">
            <div className="avatar">
              {(userEmail || 'LL').slice(0, 2).toUpperCase()}
            </div>

            <div className="profile-info">
              <strong>{userEmail || 'LedgerLine User'}</strong>
              <span>Personal Account</span>
            </div>

            <button
              className="logout-button"
              onClick={handleLogout}
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu"
              onClick={() => setMobileMenu(true)}
              aria-label="Open menu"
            >
              <Menu />
            </button>

            <div className="breadcrumb">
              Workspace <span>/</span> <strong>{activePage}</strong>
            </div>
          </div>

          <div className="topbar-right">
            <div className="search-box">
              <Search size={17} />
              <input placeholder="Search anything..." />
            </div>

            <button
              className="notification-button"
              aria-label="Notifications"
            >
              <Bell size={19} />
            </button>

            <div className="top-avatar">
              {(userEmail || 'LL').slice(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        {loadError && (
          <div className="auth-message auth-error dashboard-error">
            {loadError}
            <button onClick={loadDashboardData}>Retry</button>
          </div>
        )}

        {loading && (
          <div className="dashboard-loading">
            <RefreshCw size={20} className="auth-spinner" />
            Loading your banking information...
          </div>
        )}

        {!loading && activePage === 'Overview' && (
          <div className="dashboard">
            <section className="welcome-row">
              <div>
                <div className="eyebrow">
                  {new Date().toLocaleDateString('en-IN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  }).toUpperCase()}
                </div>

                <h1>
                  Welcome back,{' '}
                  <span>{userEmail.split('@')[0] || 'there'}!</span>
                </h1>

                <p>
                  Here's an overview of your LedgerLine accounts.
                </p>
              </div>

              <button
                className="primary-button"
                onClick={() => selectPage('My Accounts')}
              >
                <Wallet size={18} /> My Accounts
              </button>
            </section>

            <section className="balance-grid">
              <div className="balance-card">
                <div className="card-top">
                  <span>Total balance</span>

                  <button
                    className="visibility-button"
                    onClick={() => setShowBalance(!showBalance)}
                    aria-label={
                      showBalance ? 'Hide balance' : 'Show balance'
                    }
                  >
                    {showBalance ? (
                      <Eye size={18} />
                    ) : (
                      <EyeOff size={18} />
                    )}
                  </button>
                </div>

                <div className="balance-amount">
                  {showBalance
                    ? formatCurrency(totalBalance)
                    : maskedBalance}
                </div>

                <div className="balance-footer">
                  <span>
                    <i className="status-dot" /> All accounts
                  </span>

                  <span className="balance-change">
                    {accounts.length} account(s)
                  </span>
                </div>

                <div className="card-decoration decoration-one" />
                <div className="card-decoration decoration-two" />
              </div>

              <div className="stat-card">
                <div className="stat-heading">
                  <span>Total deposits</span>
                  <div className="stat-icon income-icon">
                    <ArrowDownLeft size={19} />
                  </div>
                </div>

                <div className="stat-amount">
                  {showBalance
                    ? formatCurrency(totalDeposits)
                    : maskedBalance}
                </div>

                <div className="stat-note">
                  <span>Across loaded transaction history</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-heading">
                  <span>Total withdrawals</span>
                  <div className="stat-icon expense-icon">
                    <ArrowUpRight size={19} />
                  </div>
                </div>

                <div className="stat-amount">
                  {showBalance
                    ? formatCurrency(totalWithdrawals)
                    : maskedBalance}
                </div>

                <div className="stat-note">
                  <span>Across loaded transaction history</span>
                </div>
              </div>
            </section>

            <section className="content-grid">
              <div className="panel accounts-panel">
                <div className="panel-heading">
                  <div>
                    <h2>My accounts</h2>
                    <p>Your connected LedgerLine accounts</p>
                  </div>

                  <button
                    className="text-button"
                    onClick={() => selectPage('My Accounts')}
                  >
                    View all <ArrowUpRight size={15} />
                  </button>
                </div>

                {accounts.length > 0 ? (
                  <div className="bank-card">
                    <div className="bank-card-top">
                      <div className="bank-card-brand">
                        <div className="tiny-brand">
                          <Wallet size={17} />
                        </div>
                        LedgerLine
                      </div>

                      <span className="account-status">
                        <i /> {accounts[0].status}
                      </span>
                    </div>

                    <div className="bank-card-label">
                      AVAILABLE BALANCE
                    </div>

                    <div className="bank-card-balance">
                      {showBalance
                        ? formatCurrency(accounts[0].balance)
                        : maskedBalance}
                    </div>

                    <div className="bank-card-bottom">
                      <div>
                        <span>ACCOUNT HOLDER</span>
                        <strong>{accounts[0].accountHolderName}</strong>
                      </div>

                      <div>
                        <span>ACCOUNT NUMBER</span>
                        <strong>
                          •••• ••••{' '}
                          {String(accounts[0].accountNumber).slice(-4)}
                        </strong>
                      </div>

                      <CreditCard className="card-chip" size={27} />
                    </div>
                  </div>
                ) : (
                  <div className="empty-state">
                    <Wallet size={30} />
                    <strong>No accounts found</strong>
                    <p>Create an account to get started.</p>
                  </div>
                )}

                <button
                  className="add-account"
                  onClick={() => selectPage('My Accounts')}
                >
                  <Plus size={18} /> View accounts
                </button>
              </div>

              <div className="panel quick-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Quick actions</h2>
                    <p>Explore your account activity</p>
                  </div>
                </div>

                <div className="quick-actions">
                  <button onClick={() => selectPage('Transfers')}>
                    <div className="quick-icon transfer-quick">
                      <ArrowLeftRight />
                    </div>
                    <strong>Transfer</strong>
                    <span>Send money</span>
                  </button>

                  <button onClick={() => selectPage('My Accounts')}>
                    <div className="quick-icon deposit-quick">
                      <ArrowDownLeft />
                    </div>
                    <strong>Accounts</strong>
                    <span>View accounts</span>
                  </button>

                  <button onClick={() => selectPage('Transactions')}>
                    <div className="quick-icon history-quick">
                      <ReceiptText />
                    </div>
                    <strong>History</strong>
                    <span>View activity</span>
                  </button>

                  <button onClick={loadDashboardData}>
                    <div className="quick-icon settings-quick">
                      <RefreshCw />
                    </div>
                    <strong>Refresh</strong>
                    <span>Update data</span>
                  </button>
                </div>

                <div className="security-note">
                  <div>
                    <span className="security-check">✓</span>
                  </div>

                  <p>
                    <strong>Your security matters</strong>
                    <br />
                    Your account access is protected by authentication.
                  </p>
                </div>
              </div>
            </section>

            <section className="panel transactions-panel">
              <div className="panel-heading">
                <div>
                  <h2>Recent transactions</h2>
                  <p>Your latest account activity</p>
                </div>

                <button
                  className="text-button"
                  onClick={() => selectPage('Transactions')}
                >
                  See all transactions <ArrowUpRight size={15} />
                </button>
              </div>

              <div className="transaction-table">
                <div className="table-header">
                  <span>TRANSACTION</span>
                  <span>TYPE</span>
                  <span>DATE</span>
                  <span>AMOUNT</span>
                  <span>STATUS</span>
                </div>

                {renderTransactionRows(transactions.slice(0, 5))}
              </div>
            </section>

            <footer className="dashboard-footer">
              <span>© 2026 LedgerLine. All rights reserved.</span>
              <span>Secure banking experience</span>
            </footer>
          </div>
        )}

        {!loading && activePage === 'My Accounts' && (
          <div className="dashboard">
            <section className="welcome-row">
              <div>
                <div className="eyebrow">ACCOUNT MANAGEMENT</div>
                <h1>
                  My <span>Accounts</span>
                </h1>
                <p>View your accounts and available balances.</p>
              </div>

              <button
                className="primary-button"
                onClick={loadDashboardData}
              >
                <RefreshCw size={17} /> Refresh
              </button>
            </section>

            <section className="content-grid">
              {accounts.length === 0 ? (
                <div className="panel">
                  <div className="empty-state">
                    <Wallet size={30} />
                    <strong>No accounts found</strong>
                    <p>You don't have any accounts yet.</p>
                  </div>
                </div>
              ) : (
                accounts.map((account) => (
                  <div className="panel accounts-panel" key={account.id}>
                    <div className="bank-card">
                      <div className="bank-card-top">
                        <div className="bank-card-brand">
                          <div className="tiny-brand">
                            <Wallet size={17} />
                          </div>
                          LedgerLine
                        </div>

                        <span className="account-status">
                          <i /> {account.status}
                        </span>
                      </div>

                      <div className="bank-card-label">
                        AVAILABLE BALANCE
                      </div>

                      <div className="bank-card-balance">
                        {showBalance
                          ? formatCurrency(account.balance)
                          : maskedBalance}
                      </div>

                      <div className="bank-card-bottom">
                        <div>
                          <span>ACCOUNT HOLDER</span>
                          <strong>{account.accountHolderName}</strong>
                        </div>

                        <div>
                          <span>ACCOUNT NUMBER</span>
                          <strong>
                            •••• ••••{' '}
                            {String(account.accountNumber).slice(-4)}
                          </strong>
                        </div>

                        <CreditCard className="card-chip" size={27} />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </section>
          </div>
        )}

        {!loading && activePage === 'Transactions' && (
          <div className="dashboard">
            <section className="welcome-row">
              <div>
                <div className="eyebrow">ACCOUNT ACTIVITY</div>
                <h1>
                  Transaction <span>History</span>
                </h1>
                <p>
                  Deposits and withdrawals recorded in your accounts.
                </p>
              </div>

              <button
                className="primary-button"
                onClick={loadDashboardData}
              >
                <RefreshCw size={17} /> Refresh
              </button>
            </section>

            <section className="panel transactions-panel">
              <div className="panel-heading">
                <div>
                  <h2>All transactions</h2>
                  <p>{transactions.length} transaction(s) loaded</p>
                </div>
              </div>

              <div className="transaction-table">
                <div className="table-header">
                  <span>TRANSACTION</span>
                  <span>TYPE</span>
                  <span>DATE</span>
                  <span>AMOUNT</span>
                  <span>STATUS</span>
                </div>

                {renderTransactionRows(transactions)}
              </div>
            </section>
          </div>
        )}

        {!loading && activePage === 'Transfers' && (
          <div className="placeholder-page">
            <div className="placeholder-icon">
              <ArrowLeftRight size={30} />
            </div>

            <h1>Transfers</h1>

            <p>
              Money transfers are not available yet. The backend transfer
              endpoint needs to be implemented first.
            </p>

            <button
              className="primary-button"
              onClick={() => selectPage('Overview')}
            >
              Back to overview
            </button>
          </div>
        )}

        {!loading && activePage === 'Settings' && (
          <div className="placeholder-page">
            <div className="placeholder-icon">
              <Settings size={30} />
            </div>

            <h1>Settings</h1>
            <p>Signed in as {userEmail || 'LedgerLine User'}.</p>

            <button
              className="primary-button"
              onClick={handleLogout}
            >
              <LogOut size={17} /> Sign out
            </button>
          </div>
        )}

        {!loading && activePage === 'Help & Support' && (
          <div className="placeholder-page">
            <div className="placeholder-icon">
              <HelpCircle size={30} />
            </div>

            <h1>Help & Support</h1>
            <p>LedgerLine support information will be added here.</p>

            <button
              className="primary-button"
              onClick={() => selectPage('Overview')}
            >
              Back to overview
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
