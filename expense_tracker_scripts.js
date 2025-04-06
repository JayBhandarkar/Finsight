// Expense Tracker Scripts

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM content loaded, initializing expense tracker...");
    
    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
        console.error("localStorage is not available in this browser");
        alert("Your browser doesn't support localStorage. The expense tracker will not work properly.");
        return;
    }
    
    try {
        // Check if we can access localStorage
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        console.log("localStorage is working properly");
        
        // Initialize existing data
        initializeStorage();
        
        // Initialize components
        initializeNavbar();
        initializeExpenseTracker();
        initializeCalendar();
        initializeExpenseForm();
        initializeSummary();
        addInteractiveEffects();
        
        // Force update summary to ensure data is displayed
        setTimeout(() => {
            console.log("Running delayed update to ensure charts are rendered");
            updateExpenseSummary();
        }, 500);
    } catch (e) {
        console.error("Error initializing expense tracker:", e);
        alert("There was an error initializing the expense tracker. Please try reloading the page.");
    }
});

// Initialize storage for expenses
function initializeStorage() {
    if (!localStorage.getItem('expenses')) {
        console.log("Creating empty expenses array in localStorage");
        localStorage.setItem('expenses', JSON.stringify([]));
    } else {
        const expenses = JSON.parse(localStorage.getItem('expenses'));
        console.log(`Found ${expenses.length} existing expenses in localStorage`);
    }
}

// Get all expenses from storage
function getExpenses() {
    initializeStorage();
    const expenses = JSON.parse(localStorage.getItem('expenses'));
    console.log(`Retrieved ${expenses.length} expenses from localStorage`);
    return expenses;
}

// Get expenses for a specific month
function getExpensesForMonth(month, year) {
    const allExpenses = getExpenses();
    return allExpenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === month && expenseDate.getFullYear() === year;
    });
}

// Add a new expense
function addExpense(expense) {
    const expenses = getExpenses();
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    return expense;
}

// Calculate totals
function calculateTotals() {
    const expenses = getExpenses();
    
    // For this demo, we'll consider positive amounts as income and negative as expenses
    let totalIncome = 0;
    let totalExpenses = 0;
    
    expenses.forEach(expense => {
        const amount = parseFloat(expense.amount);
        if (amount >= 0) {
            totalIncome += amount;
        } else {
            totalExpenses += Math.abs(amount);
        }
    });
    
    const balance = totalIncome - totalExpenses;
    
    return {
        balance: balance,
        income: totalIncome,
        expenses: totalExpenses
    };
}

// Calculate separate category breakdowns for income and expenses
function calculateCategoryBreakdowns() {
    const expenses = getExpenses();
    console.log(`Calculating breakdowns for ${expenses.length} transactions`);
    
    const expenseCategories = {};
    const incomeCategories = {};
    
    // Group transactions by category and type
    expenses.forEach(expense => {
        const amount = Math.abs(parseFloat(expense.amount));
        const category = expense.category;
        
        if (parseFloat(expense.amount) < 0) {
            // It's an expense
            if (!expenseCategories[category]) {
                expenseCategories[category] = 0;
            }
            expenseCategories[category] += amount;
        } else {
            // It's income
            if (!incomeCategories[category]) {
                incomeCategories[category] = 0;
            }
            incomeCategories[category] += amount;
        }
    });
    
    // Convert to array format for charts
    const expenseData = Object.keys(expenseCategories).map(name => ({
        name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
        amount: expenseCategories[name]
    }));
    
    const incomeData = Object.keys(incomeCategories).map(name => ({
        name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
        amount: incomeCategories[name]
    }));
    
    console.log(`Found ${expenseData.length} expense categories and ${incomeData.length} income categories`);
    console.log("Expense data:", expenseData);
    console.log("Income data:", incomeData);
    
    return {
        expenses: expenseData,
        income: incomeData
    };
}

// Add demo data for testing
function loadDemoData() {
    // Clear existing data
    localStorage.removeItem('expenses');
    initializeStorage();
    
    // Demo expense transactions
    const demoExpenses = [
        {
            date: '2023-12-15',
            amount: -150.25,
            category: 'food',
            description: 'Grocery shopping',
            type: 'expense',
            id: Date.now() - 10000
        },
        {
            date: '2023-12-16',
            amount: -45.80,
            category: 'entertainment',
            description: 'Movie tickets',
            type: 'expense',
            id: Date.now() - 9000
        },
        {
            date: '2023-12-17',
            amount: -210.50,
            category: 'shopping',
            description: 'New clothes',
            type: 'expense',
            id: Date.now() - 8000
        },
        {
            date: '2023-12-18',
            amount: -65.30,
            category: 'transportation',
            description: 'Gas',
            type: 'expense',
            id: Date.now() - 7000
        },
        {
            date: '2023-12-20',
            amount: -120.00,
            category: 'utilities',
            description: 'Electricity bill',
            type: 'expense',
            id: Date.now() - 6000
        },
        {
            date: '2023-12-22',
            amount: -85.75,
            category: 'healthcare',
            description: 'Pharmacy',
            type: 'expense',
            id: Date.now() - 5000
        }
    ];
    
    // Demo income transactions
    const demoIncome = [
        {
            date: '2023-12-01',
            amount: 1500.00,
            category: 'salary',
            description: 'Monthly salary',
            type: 'income',
            id: Date.now() - 4000
        },
        {
            date: '2023-12-10',
            amount: 250.00,
            category: 'freelance',
            description: 'Freelance project',
            type: 'income',
            id: Date.now() - 3000
        },
        {
            date: '2023-12-20',
            amount: 100.00,
            category: 'investment',
            description: 'Dividend payment',
            type: 'income',
            id: Date.now() - 2000
        }
    ];
    
    // Combine and save all demo data
    const allDemoData = [...demoExpenses, ...demoIncome];
    localStorage.setItem('expenses', JSON.stringify(allDemoData));
    
    // Update the UI
    updateExpenseSummary();
    
    // Update calendar to show demo data
    const today = new Date();
    renderCalendar(today.getMonth(), today.getFullYear(), today.getDate());
    
    // Show confirmation message
    showNotification('Demo data loaded successfully', 'success');
    
    console.log('Demo data loaded:', allDemoData);
}

// Initialize Expense Tracker functionality
function initializeExpenseTracker() {
    // Add animations for tracker elements
    document.querySelectorAll('.calendar-container, .expense-form-container, .expense-summary-container').forEach(container => {
        container.classList.add('animate-on-scroll');
    });
    
    // Setup tab functionality if exists
    const tabButtons = document.querySelectorAll('.expense-tab-button');
    const tabContents = document.querySelectorAll('.expense-tab-content');
    
    if (tabButtons.length > 0 && tabContents.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to current button
                button.classList.add('active');
                
                // Hide all tab contents
                tabContents.forEach(content => content.style.display = 'none');
                
                // Show the selected tab content
                const tabId = button.getAttribute('data-tab');
                document.querySelector(`.expense-tab-content[data-tab="${tabId}"]`).style.display = 'block';
            });
        });
        
        // Set the first tab as active by default
        tabButtons[0].click();
    }
    
    // Add refresh button to the summary section
    const summaryContainer = document.querySelector('.expense-summary-container');
    if (summaryContainer) {
        const headingElement = summaryContainer.querySelector('h3');
        if (headingElement) {
            const refreshIcon = document.createElement('i');
            refreshIcon.className = 'fas fa-sync-alt';
            refreshIcon.style.marginLeft = '10px';
            refreshIcon.style.fontSize = '0.9rem';
            refreshIcon.style.cursor = 'pointer';
            refreshIcon.style.opacity = '0.7';
            refreshIcon.style.transition = 'all 0.3s ease';
            refreshIcon.title = 'Refresh Charts';
            
            refreshIcon.addEventListener('mouseenter', () => {
                refreshIcon.style.opacity = '1';
                refreshIcon.style.transform = 'rotate(180deg)';
            });
            
            refreshIcon.addEventListener('mouseleave', () => {
                refreshIcon.style.opacity = '0.7';
                refreshIcon.style.transform = 'rotate(0)';
            });
            
            refreshIcon.addEventListener('click', () => {
                refreshIcon.style.animation = 'spin 1s linear';
                setTimeout(() => {
                    refreshIcon.style.animation = '';
                }, 1000);
                
                refreshExpenseTracker();
            });
            
            const styleEl = document.createElement('style');
            styleEl.innerHTML = `
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(styleEl);
            
            headingElement.appendChild(refreshIcon);
        }
    }
    
    // Add demo data button for testing if in development environment
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:') {
        const summaryContainer = document.querySelector('.expense-summary-container');
        if (summaryContainer) {
            const demoButton = document.createElement('button');
            demoButton.textContent = 'Load Demo Data';
            demoButton.style.marginTop = '10px';
            demoButton.style.padding = '8px 12px';
            demoButton.style.backgroundColor = '#6c5ce7';
            demoButton.style.color = 'white';
            demoButton.style.border = 'none';
            demoButton.style.borderRadius = '4px';
            demoButton.style.cursor = 'pointer';
            demoButton.addEventListener('click', loadDemoData);
            summaryContainer.appendChild(demoButton);
        }
    }
}

// Navbar functionality
function initializeNavbar() {
    const navbar = document.querySelector('.navbar');
    
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                }
            }
        });
    });
}

// Calendar functionality
function initializeCalendar() {
    const date = new Date();
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();
    const currentDay = date.getDate();
    
    renderCalendar(currentMonth, currentYear, currentDay);
    
    // Add event listeners to navigation buttons
    document.querySelector('.prev-month').addEventListener('click', function() {
        const monthYear = document.querySelector('.calendar-month-year').dataset;
        let month = parseInt(monthYear.month);
        let year = parseInt(monthYear.year);
        
        month--;
        if (month < 0) {
            month = 11;
            year--;
        }
        
        renderCalendar(month, year);
    });
    
    document.querySelector('.next-month').addEventListener('click', function() {
        const monthYear = document.querySelector('.calendar-month-year').dataset;
        let month = parseInt(monthYear.month);
        let year = parseInt(monthYear.year);
        
        month++;
        if (month > 11) {
            month = 0;
            year++;
        }
        
        renderCalendar(month, year);
    });
}

function renderCalendar(month, year, selectedDay = null) {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    // Update month and year display
    const monthYearElement = document.querySelector('.calendar-month-year');
    monthYearElement.textContent = `${monthNames[month]} ${year}`;
    monthYearElement.dataset.month = month;
    monthYearElement.dataset.year = year;
    
    // Generate calendar days
    const calendarDays = document.querySelector('.calendar-days');
    calendarDays.innerHTML = '';
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.classList.add('calendar-day', 'empty');
        calendarDays.appendChild(emptyDay);
    }
    
    // Get user's expenses for the month from localStorage
    const transactions = getExpensesForMonth(month, year);
    
    // Add cells for actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day');
        
        // Check if this is the current day
        const today = new Date();
        if (day === selectedDay && month === today.getMonth() && year === today.getFullYear()) {
            dayElement.classList.add('current-day');
        }
        
        // Add day number
        const dayNumber = document.createElement('div');
        dayNumber.classList.add('day-number');
        dayNumber.textContent = day;
        dayElement.appendChild(dayNumber);
        
        // Find transactions for this day
        const dayTransactions = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate.getDate() === day;
        });
        
        // Calculate expenses and income
        let dayExpensesAmount = 0;
        let dayIncomeAmount = 0;
        let hasIncome = false;
        let hasExpense = false;
        
        dayTransactions.forEach(transaction => {
            const amount = parseFloat(transaction.amount);
            if (amount < 0) {
                // Expense
                dayExpensesAmount += Math.abs(amount);
                hasExpense = true;
            } else {
                // Income
                dayIncomeAmount += amount;
                hasIncome = true;
            }
        });
        
        // Add appropriate markers
        if (hasExpense) {
            const expenseMarker = document.createElement('div');
            expenseMarker.classList.add('expense-marker');
            dayElement.appendChild(expenseMarker);
        }
        
        if (hasIncome) {
            const incomeMarker = document.createElement('div');
            incomeMarker.classList.add('income-marker');
            dayElement.appendChild(incomeMarker);
        }
        
        if (dayTransactions.length > 0) {
            // Create enhanced transaction preview popup
            const previewPopup = document.createElement('div');
            previewPopup.classList.add('expense-day-preview');
            
            // Add header with date
            const date = new Date(year, month, day);
            const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            
            const previewHeader = document.createElement('div');
            previewHeader.classList.add('preview-header');
            previewHeader.innerHTML = `
                <strong>${dateStr}</strong>
                <span>${dayTransactions.length} item${dayTransactions.length > 1 ? 's' : ''}</span>
            `;
            previewPopup.appendChild(previewHeader);
            
            // Add total amounts
            if (hasIncome) {
                const incomeTotal = document.createElement('div');
                incomeTotal.classList.add('preview-total', 'income');
                incomeTotal.innerHTML = `Income: $${dayIncomeAmount.toFixed(2)}`;
                previewPopup.appendChild(incomeTotal);
            }
            
            if (hasExpense) {
                const expenseTotal = document.createElement('div');
                expenseTotal.classList.add('preview-total', 'expense');
                expenseTotal.innerHTML = `Expenses: $${dayExpensesAmount.toFixed(2)}`;
                previewPopup.appendChild(expenseTotal);
            }
            
            // List up to 3 transactions with details
            const transactionsToShow = dayTransactions.slice(0, 3);
            transactionsToShow.forEach(transaction => {
                const item = document.createElement('div');
                item.classList.add('preview-item');
                
                const isExpense = parseFloat(transaction.amount) < 0;
                const amount = Math.abs(parseFloat(transaction.amount));
                
                item.innerHTML = `
                    <span class="preview-category">${transaction.category}</span>
                    <span class="${isExpense ? 'expense' : 'income'}">
                        ${isExpense ? '-' : '+'} $${amount.toFixed(2)}
                    </span>
                `;
                previewPopup.appendChild(item);
            });
            
            // Add "more" indicator if there are more transactions
            if (dayTransactions.length > 3) {
                const moreIndicator = document.createElement('div');
                moreIndicator.classList.add('preview-item');
                moreIndicator.style.justifyContent = 'center';
                moreIndicator.style.opacity = '0.7';
                moreIndicator.textContent = `and ${dayTransactions.length - 3} more...`;
                previewPopup.appendChild(moreIndicator);
            }
            
            dayElement.appendChild(previewPopup);
        }
        
        // Add click event to each day
        dayElement.addEventListener('click', function() {
            document.querySelectorAll('.calendar-day').forEach(day => {
                day.classList.remove('selected');
            });
            this.classList.add('selected');
            
            // Update expense form date
            const selectedDate = new Date(year, month, day);
            updateFormDate(selectedDate);
        });
        
        calendarDays.appendChild(dayElement);
    }
}

function updateFormDate(date) {
    const formattedDate = date.toISOString().split('T')[0];
    document.querySelector('#expense-date').value = formattedDate;
}

// Expense form functionality
function initializeExpenseForm() {
    const expenseForm = document.querySelector('#expense-form');
    const transactionTypeToggle = document.querySelector('#transaction-type-toggle');
    const submitBtn = document.querySelector('#submit-transaction-btn');
    const expenseCategoryDiv = document.querySelector('.expense-category');
    const incomeCategoryDiv = document.querySelector('.income-category');
    
    // Set default date to today
    const today = new Date();
    updateFormDate(today);
    
    // Handle transaction type toggle (Expense/Income)
    transactionTypeToggle.addEventListener('change', function() {
        if (this.checked) {
            // Income mode
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Add Income';
            expenseCategoryDiv.style.display = 'none';
            incomeCategoryDiv.style.display = 'block';
        } else {
            // Expense mode
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Add Expense';
            expenseCategoryDiv.style.display = 'block';
            incomeCategoryDiv.style.display = 'none';
        }
    });
    
    expenseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const date = document.querySelector('#expense-date').value;
        let amount = parseFloat(document.querySelector('#expense-amount').value);
        const description = document.querySelector('#expense-description').value;
        
        // Get the appropriate category based on transaction type
        let category;
        let transactionType;
        
        if (transactionTypeToggle.checked) {
            // It's income
            category = document.querySelector('#income-category').value;
            transactionType = 'income';
        } else {
            // It's an expense - make amount negative
            category = document.querySelector('#expense-category').value;
            amount = -Math.abs(amount); // Ensure it's negative
            transactionType = 'expense';
        }
        
        if (!date || !amount || !category) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Create new transaction object
        const newTransaction = {
            date: date,
            amount: amount,
            category: category,
            description: description || (transactionType === 'income' ? 'Income' : 'Expense'),
            type: transactionType,
            id: Date.now() // Simple unique ID
        };
        
        // Add to localStorage
        addExpense(newTransaction);
        
        // Show success notification
        showNotification(`${transactionType === 'income' ? 'Income' : 'Expense'} added successfully!`, 'success');
        
        // Reset form fields
        document.querySelector('#expense-description').value = '';
        document.querySelector('#expense-amount').value = '';
        
        // Update summary with new data
        updateExpenseSummary();
        
        // Update calendar to reflect new transaction
        const currentMonth = parseInt(document.querySelector('.calendar-month-year').dataset.month);
        const currentYear = parseInt(document.querySelector('.calendar-month-year').dataset.year);
        renderCalendar(currentMonth, currentYear, new Date(date).getDate());
    });
}

// Summary functionality
function initializeSummary() {
    console.log("Initializing expense summary");
    
    // Initialize charts first before loading data
    initializeCharts();
    
    // Then update with actual data
    updateExpenseSummary();
    
    // Add a button to manually refresh data if needed
    const summaryContainer = document.querySelector('.expense-summary-container');
    if (summaryContainer) {
        const refreshButton = document.createElement('button');
        refreshButton.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Charts';
        refreshButton.style.marginTop = '15px';
        refreshButton.style.padding = '8px 15px';
        refreshButton.style.fontSize = '0.9rem';
        refreshButton.style.backgroundColor = 'rgba(108, 92, 231, 0.2)';
        refreshButton.style.border = '1px solid rgba(108, 92, 231, 0.4)';
        refreshButton.style.borderRadius = '6px';
        refreshButton.style.color = 'white';
        refreshButton.style.cursor = 'pointer';
        
        refreshButton.addEventListener('click', () => {
            console.log("Manual refresh requested");
            updateExpenseSummary();
            showNotification('Charts refreshed', 'success');
        });
        
        summaryContainer.appendChild(refreshButton);
    }
}

function updateExpenseSummary() {
    console.log("Updating expense summary from localStorage");
    
    // Get totals from localStorage
    const totals = calculateTotals();
    console.log("Calculated totals:", totals);
    
    // Update summary cards with formatted values
    document.querySelector('.total-balance .summary-amount').textContent = `$${totals.balance.toFixed(2)}`;
    document.querySelector('.total-income .summary-amount').textContent = `$${totals.income.toFixed(2)}`;
    document.querySelector('.total-expenses .summary-amount').textContent = `$${totals.expenses.toFixed(2)}`;
    
    // Get category breakdowns for both income and expenses
    const breakdowns = calculateCategoryBreakdowns();
    console.log("Category breakdowns:", breakdowns);
    
    // Update charts
    updateCharts(breakdowns);
}

// Initialize chart functionality
function initializeCharts() {
    console.log("Initializing chart controls");
    
    // Set up tabs
    const chartTabs = document.querySelectorAll('.chart-tab');
    const charts = document.querySelectorAll('.category-chart');
    
    chartTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            console.log("Chart tab clicked:", tab.getAttribute('data-chart'));
            
            // Remove active class from all tabs and charts
            chartTabs.forEach(t => t.classList.remove('active'));
            charts.forEach(c => {
                c.classList.remove('active');
                c.style.opacity = '0';
                c.style.visibility = 'hidden';
            });
            
            // Add active class to clicked tab and corresponding chart
            tab.classList.add('active');
            const chartType = tab.getAttribute('data-chart');
            const activeChart = document.querySelector(`.${chartType}-chart`);
            activeChart.classList.add('active');
            activeChart.style.opacity = '1';
            activeChart.style.visibility = 'visible';
            
            // Update category list to match the active chart
            updateCategoryList(chartType);
        });
    });
    
    // Verify chart containers
    document.querySelectorAll('.category-chart').forEach(chart => {
        console.log("Found chart container:", chart.className);
    });
    
    // Create empty charts initially
    createEmptyChart('expenses');
    createEmptyChart('income');
    
    // Activate the expenses tab by default
    if (chartTabs.length > 0) {
        const firstTab = document.querySelector('.chart-tab[data-chart="expenses"]');
        if (firstTab) {
            console.log("Setting default active tab");
            firstTab.click();
        }
    }
}

// Create empty chart with placeholder
function createEmptyChart(chartType) {
    const chartContainer = document.querySelector(`.${chartType}-chart`);
    chartContainer.innerHTML = '';
    
    // Add placeholder text for empty chart
    const emptyChartMessage = document.createElement('div');
    emptyChartMessage.style.position = 'absolute';
    emptyChartMessage.style.top = '50%';
    emptyChartMessage.style.left = '50%';
    emptyChartMessage.style.transform = 'translate(-50%, -50%)';
    emptyChartMessage.style.textAlign = 'center';
    emptyChartMessage.style.color = 'rgba(255, 255, 255, 0.6)';
    emptyChartMessage.style.width = '100%';
    
    const icon = chartType === 'expenses' ? 'fa-receipt' : 'fa-money-bill-wave';
    const text = chartType === 'expenses' ? 'spending' : 'income';
    
    emptyChartMessage.innerHTML = `<i class="fas ${icon}" style="font-size: 2rem; margin-bottom: 1rem; display: block; opacity: 0.4;"></i>Add ${text} to see your ${text} breakdown`;
    
    chartContainer.appendChild(emptyChartMessage);
}

// Update charts with data
function updateCharts(data) {
    console.log("Updating charts with actual data:", data);
    
    try {
        // Clear previous chart content first
        document.querySelectorAll('.category-chart').forEach(chart => {
            chart.innerHTML = '';
        });
        
        // Update expense chart if we have expense data
        if (data.expenses && data.expenses.length > 0) {
            console.log("Creating expense bar chart with", data.expenses.length, "categories");
            createBarChart('expenses', data.expenses);
        } else {
            console.log("No expense data found, showing empty chart");
            createEmptyChart('expenses');
        }
        
        // Update income chart if we have income data
        if (data.income && data.income.length > 0) {
            console.log("Creating income bar chart with", data.income.length, "categories");
            createBarChart('income', data.income);
        } else {
            console.log("No income data found, showing empty chart");
            createEmptyChart('income');
        }
        
        // Make sure the active tab's chart is visible
        const activeTab = document.querySelector('.chart-tab.active');
        let activeChartType = 'expenses'; // Default active chart
        
        if (activeTab) {
            activeChartType = activeTab.getAttribute('data-chart');
        } else {
            // No active tab, set expenses as default
            const expensesTab = document.querySelector('.chart-tab[data-chart="expenses"]');
            if (expensesTab) {
                expensesTab.classList.add('active');
            }
        }
        
        // Hide all charts first
        document.querySelectorAll('.category-chart').forEach(chart => {
            chart.classList.remove('active');
            chart.style.opacity = '0';
            chart.style.visibility = 'hidden';
            chart.style.display = 'none';
        });
        
        // Show only the active chart
        const activeChart = document.querySelector(`.${activeChartType}-chart`);
        if (activeChart) {
            activeChart.classList.add('active');
            activeChart.style.opacity = '1';
            activeChart.style.visibility = 'visible';
            activeChart.style.display = 'block';
            console.log(`Activated chart: ${activeChartType}`);
        } else {
            console.error(`Could not find chart container for ${activeChartType}`);
        }
        
        // Update category list to match active chart
        updateCategoryList(activeChartType);
        
    } catch (error) {
        console.error("Error updating charts:", error);
        showNotification('Error updating charts', 'error');
    }
}

// Create a bar chart
function createBarChart(chartType, categories) {
    console.log(`Creating ${chartType} bar chart with categories:`, categories);
    
    try {
        const chartContainer = document.querySelector(`.${chartType}-chart`);
        if (!chartContainer) {
            console.error(`Chart container for ${chartType} not found`);
            return;
        }
        
        // Clear previous content
        chartContainer.innerHTML = '';
        
        // Sort categories by amount (descending)
        categories.sort((a, b) => b.amount - a.amount);
        
        // Limit to top 6 categories
        const topCategories = categories.slice(0, 6);
        
        // Calculate the maximum value for scaling
        const maxAmount = Math.max(...topCategories.map(cat => cat.amount));
        
        console.log(`Creating bars for ${topCategories.length} categories with max amount: ${maxAmount}`);
        
        // Create a backup div to ensure the chart is properly displayed
        const chartBackupDiv = document.createElement('div');
        chartBackupDiv.style.position = 'absolute';
        chartBackupDiv.style.top = '0';
        chartBackupDiv.style.left = '0';
        chartBackupDiv.style.width = '100%';
        chartBackupDiv.style.height = '100%';
        chartBackupDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        chartBackupDiv.style.borderRadius = '8px';
        chartContainer.appendChild(chartBackupDiv);
        
        // Create bar container with inline styles to ensure it's displayed properly
        const barContainer = document.createElement('div');
        barContainer.classList.add('bar-container');
        barContainer.style.display = 'flex';
        barContainer.style.height = '100%';
        barContainer.style.alignItems = 'flex-end';
        barContainer.style.width = '100%';
        barContainer.style.position = 'absolute';
        barContainer.style.top = '0';
        barContainer.style.left = '0';
        barContainer.style.padding = '10px';
        barContainer.style.boxSizing = 'border-box';
        barContainer.style.zIndex = '5';
        
        // Create bars for each category
        topCategories.forEach((category, index) => {
            const barGroup = document.createElement('div');
            barGroup.classList.add('bar-group');
            barGroup.style.display = 'flex';
            barGroup.style.flexDirection = 'column';
            barGroup.style.alignItems = 'center';
            barGroup.style.justifyContent = 'flex-end';
            barGroup.style.height = '100%';
            barGroup.style.flex = '1';
            
            const bar = document.createElement('div');
            bar.classList.add('bar');
            
            // Calculate height percentage based on max value
            const heightPercentage = (category.amount / maxAmount) * 100;
            // Ensure minimum visible height for very small values
            const barHeight = Math.max(heightPercentage, 5);
            
            // Set explicit styles to ensure visibility
            bar.style.width = '70%';
            bar.style.height = `${barHeight}%`;
            bar.style.position = 'relative';
            bar.style.borderRadius = '6px 6px 0 0';
            
            if (chartType === 'expenses') {
                bar.style.background = 'linear-gradient(to top, rgba(214, 48, 49, 0.7), rgba(214, 48, 49, 0.3))';
                bar.style.boxShadow = '0 0 10px rgba(214, 48, 49, 0.4)';
            } else {
                bar.style.background = 'linear-gradient(to top, rgba(0, 184, 148, 0.7), rgba(0, 184, 148, 0.3))';
                bar.style.boxShadow = '0 0 10px rgba(0, 184, 148, 0.4)';
            }
            
            console.log(`Bar ${index+1} for ${category.name}: height=${barHeight}%, amount=${category.amount}`);
            
            // Add value label that shows on hover
            const barValue = document.createElement('div');
            barValue.classList.add('bar-value');
            barValue.textContent = `$${category.amount.toFixed(2)}`;
            barValue.style.position = 'absolute';
            barValue.style.top = '-20px';
            barValue.style.left = '50%';
            barValue.style.transform = 'translateX(-50%)';
            barValue.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            barValue.style.color = 'white';
            barValue.style.padding = '2px 6px';
            barValue.style.borderRadius = '4px';
            barValue.style.fontSize = '0.65rem';
            barValue.style.whiteSpace = 'nowrap';
            barValue.style.zIndex = '10';
            bar.appendChild(barValue);
            
            // Add always-visible label with amount
            const barAmount = document.createElement('div');
            barAmount.textContent = `$${category.amount.toFixed(0)}`;
            barAmount.style.fontSize = '0.65rem';
            barAmount.style.color = 'white';
            barAmount.style.marginBottom = '5px';
            barAmount.style.textAlign = 'center';
            
            // Add category label
            const barLabel = document.createElement('div');
            barLabel.classList.add('bar-label');
            barLabel.textContent = category.name;
            barLabel.style.fontSize = '0.7rem';
            barLabel.style.color = 'rgba(255, 255, 255, 0.7)';
            barLabel.style.marginTop = '5px';
            barLabel.style.textAlign = 'center';
            barLabel.style.maxWidth = '100%';
            barLabel.style.overflow = 'hidden';
            barLabel.style.textOverflow = 'ellipsis';
            
            barGroup.appendChild(barAmount);
            barGroup.appendChild(bar);
            barGroup.appendChild(barLabel);
            barContainer.appendChild(barGroup);
        });
        
        chartContainer.appendChild(barContainer);
        
        // Make sure the chart is visible
        chartContainer.style.opacity = '1';
        chartContainer.style.visibility = 'visible';
        chartContainer.style.display = 'block';
        
        console.log(`${chartType} chart created with ${topCategories.length} bars`);
    } catch (error) {
        console.error("Error creating bar chart:", error);
    }
}

// Update category list to match the selected chart type
function updateCategoryList(chartType) {
    const categoryList = document.querySelector('.category-list');
    categoryList.innerHTML = '';
    
    const breakdowns = calculateCategoryBreakdowns();
    const categories = breakdowns[chartType];
    
    // If no categories yet, show a placeholder message
    if (categories.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.style.gridColumn = 'span 2';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.padding = '1rem';
        emptyMessage.style.color = 'rgba(255, 255, 255, 0.6)';
        emptyMessage.textContent = `No ${chartType} added yet.`;
        categoryList.appendChild(emptyMessage);
        return;
    }
    
    // Color mappings for categories
    const categoryColors = {
        // Expense categories
        'Food': '#FF6B6B',
        'Housing': '#4ECDC4',
        'Transportation': '#FFA400',
        'Entertainment': '#9C89B8',
        'Shopping': '#F8B195',
        'Utilities': '#50B2C0',
        'Healthcare': '#6A0572',
        
        // Income categories
        'Salary': '#00b894',
        'Freelance': '#00cec9',
        'Investment': '#55efc4',
        'Gift': '#74b9ff',
        
        // Fallback
        'Other': '#434343'
    };
    
    // Sort categories by amount (descending)
    categories.sort((a, b) => b.amount - a.amount);
    
    categories.forEach(category => {
        const categoryItem = document.createElement('div');
        categoryItem.classList.add('category-item');
        
        const color = categoryColors[category.name] || '#cccccc';
        
        categoryItem.innerHTML = `
            <div class="category-color" style="background-color: ${color}"></div>
            <div class="category-name">${category.name}</div>
            <div class="category-amount">$${category.amount.toFixed(2)}</div>
        `;
        
        categoryList.appendChild(categoryItem);
    });
}

// Helper functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.classList.add('notification', `notification-${type}`);
    notification.textContent = message;
    
    // Add styles
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '8px';
    notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    notification.style.zIndex = '1000';
    notification.style.transform = 'translateY(20px)';
    notification.style.opacity = '0';
    notification.style.transition = 'all 0.3s ease';
    
    if (type === 'success') {
        notification.style.backgroundColor = 'rgba(0, 184, 148, 0.9)';
        notification.style.color = 'white';
        notification.style.boxShadow = '0 4px 12px rgba(0, 184, 148, 0.4), 0 0 15px rgba(0, 184, 148, 0.6)';
    } else if (type === 'error') {
        notification.style.backgroundColor = 'rgba(214, 48, 49, 0.9)';
        notification.style.color = 'white';
        notification.style.boxShadow = '0 4px 12px rgba(214, 48, 49, 0.4), 0 0 15px rgba(214, 48, 49, 0.6)';
    } else {
        notification.style.backgroundColor = 'rgba(108, 92, 231, 0.9)';
        notification.style.color = 'white';
        notification.style.boxShadow = '0 4px 12px rgba(108, 92, 231, 0.4), 0 0 15px rgba(108, 92, 231, 0.6)';
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateY(20px)';
        notification.style.opacity = '0';
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Interactive effects
function addInteractiveEffects() {
    // Add glow effect to buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 0 25px var(--expense-glow)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 0 15px var(--expense-glow)';
        });
    });
    
    // Add floating backgrounds effect
    addFloatingBackground();
    
    // Add intersection observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });
}

function addFloatingBackground() {
    const projectHero = document.querySelector('.project-hero');
    if (!projectHero) return;
    
    // Create floating orbs
    for (let i = 0; i < 5; i++) {
        const orb = document.createElement('div');
        orb.classList.add('floating-orb');
        
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // Random size
        const size = Math.random() * 150 + 50;
        
        // Style the orb
        orb.style.position = 'absolute';
        orb.style.top = `${posY}%`;
        orb.style.left = `${posX}%`;
        orb.style.width = `${size}px`;
        orb.style.height = `${size}px`;
        orb.style.borderRadius = '50%';
        orb.style.background = 'radial-gradient(circle at center, rgba(108, 92, 231, 0.2), transparent)';
        orb.style.filter = 'blur(20px)';
        orb.style.opacity = '0.6';
        orb.style.zIndex = '-1';
        
        // Animation
        orb.style.animation = `float ${Math.random() * 10 + 10}s infinite ease-in-out`;
        
        // Add to hero
        projectHero.appendChild(orb);
    }
    
    // Add keyframes for floating animation
    const styleSheet = document.createElement('style');
    styleSheet.innerHTML = `
        @keyframes float {
            0% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px) scale(${Math.random() * 0.4 + 0.8}); }
            100% { transform: translate(0, 0) scale(1); }
        }
    `;
    document.head.appendChild(styleSheet);
}

// Force update charts - bypasses the normal update function to ensure a complete redraw
function forceUpdateCharts(data) {
    console.log("Force updating charts with data:", data);
    
    try {
        // Update expense chart if we have expense data
        if (data.expenses && data.expenses.length > 0) {
            console.log("Creating expense bar chart with", data.expenses.length, "categories");
            createBarChart('expenses', data.expenses);
        } else {
            console.log("No expense data found, showing empty chart");
            createEmptyChart('expenses');
        }
        
        // Update income chart if we have income data
        if (data.income && data.income.length > 0) {
            console.log("Creating income bar chart with", data.income.length, "categories");
            createBarChart('income', data.income);
        } else {
            console.log("No income data found, showing empty chart");
            createEmptyChart('income');
        }
        
        // Make active chart visible (always show expenses first)
        const expensesChart = document.querySelector('.expenses-chart');
        if (expensesChart) {
            expensesChart.classList.add('active');
            expensesChart.style.opacity = '1';
            expensesChart.style.visibility = 'visible';
            expensesChart.style.display = 'block';
            console.log("Activated expenses chart");
        }
        
        // Update category list for expenses
        updateCategoryList('expenses');
        
    } catch (error) {
        console.error("Error force updating charts:", error);
    }
}

// Global refresh function that can be called from console
function refreshExpenseTracker() {
    console.log("Manually refreshing expense tracker data");
    
    try {
        // Clear any existing chart data and charts
        document.querySelectorAll('.category-chart').forEach(chart => {
            chart.innerHTML = '';
            chart.style.opacity = '0';
            chart.style.visibility = 'hidden';
            chart.style.display = 'none';
            chart.classList.remove('active');
        });
        
        // Reset chart tabs
        document.querySelectorAll('.chart-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Set expenses tab as active
        const expensesTab = document.querySelector('.chart-tab[data-chart="expenses"]');
        if (expensesTab) {
            expensesTab.classList.add('active');
        }
        
        // Force reload of data from localStorage
        initializeStorage();
        
        // Update summary with new data - directly call the individual functions
        // instead of using updateExpenseSummary to avoid any issues
        const totals = calculateTotals();
        
        // Update summary cards with formatted values
        document.querySelector('.total-balance .summary-amount').textContent = `$${totals.balance.toFixed(2)}`;
        document.querySelector('.total-income .summary-amount').textContent = `$${totals.income.toFixed(2)}`;
        document.querySelector('.total-expenses .summary-amount').textContent = `$${totals.expenses.toFixed(2)}`;
        
        // Get category breakdowns and update charts
        const breakdowns = calculateCategoryBreakdowns();
        forceUpdateCharts(breakdowns);
        
        // Update calendar
        const currentMonth = parseInt(document.querySelector('.calendar-month-year').dataset.month);
        const currentYear = parseInt(document.querySelector('.calendar-month-year').dataset.year);
        const today = new Date();
        renderCalendar(currentMonth, currentYear, today.getDate());
        
        showNotification('Charts refreshed successfully', 'success');
        
        return "Expense tracker refreshed successfully!";
    } catch (error) {
        console.error("Error refreshing expense tracker:", error);
        showNotification('Error refreshing charts', 'error');
        return "Error refreshing expense tracker. See console for details.";
    }
}

// Make function accessible globally
window.refreshExpenseTracker = refreshExpenseTracker; 