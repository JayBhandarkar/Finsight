class FinancialCalendar {
    constructor() {
        this.currentDate = new Date();
        this.expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        this.categories = ['food', 'transport', 'entertainment', 'bills', 'shopping', 'other'];
        
        this.initializeElements();
        this.setupEventListeners();
        this.renderCalendar();
        this.updateMonthlySummary();
    }

    initializeElements() {
        this.calendarGrid = document.getElementById('calendar-grid');
        this.currentMonthElement = document.getElementById('current-month');
        this.prevMonthButton = document.getElementById('prev-month');
        this.nextMonthButton = document.getElementById('next-month');
        this.expenseForm = document.getElementById('expense-form');
        this.totalExpensesElement = document.getElementById('total-expenses');
        this.categoryBreakdownElement = document.getElementById('category-breakdown');
    }

    setupEventListeners() {
        this.prevMonthButton.addEventListener('click', () => this.navigateMonth(-1));
        this.nextMonthButton.addEventListener('click', () => this.navigateMonth(1));
        this.expenseForm.addEventListener('submit', (e) => this.handleExpenseSubmit(e));
    }

    navigateMonth(offset) {
        this.currentDate.setMonth(this.currentDate.getMonth() + offset);
        this.renderCalendar();
        this.updateMonthlySummary();
    }

    renderCalendar() {
        this.calendarGrid.innerHTML = '';
        this.currentMonthElement.textContent = this.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        
        const startingDay = firstDay.getDay();
        const totalDays = lastDay.getDate();

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDay; i++) {
            this.calendarGrid.appendChild(this.createEmptyDay());
        }

        // Add cells for each day of the month
        for (let day = 1; day <= totalDays; day++) {
            const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
            this.calendarGrid.appendChild(this.createDayElement(day, date));
        }
    }

    createEmptyDay() {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day empty';
        return dayElement;
    }

    createDayElement(day, date) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        if (this.isToday(date)) {
            dayElement.classList.add('today');
        }

        const dateElement = document.createElement('div');
        dateElement.className = 'date';
        dateElement.textContent = day;
        dayElement.appendChild(dateElement);

        const dayExpenses = this.getExpensesForDate(date);
        if (dayExpenses.length > 0) {
            const total = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
            const totalElement = document.createElement('div');
            totalElement.className = 'day-total';
            totalElement.textContent = `₹${total.toFixed(2)}`;
            dayElement.appendChild(totalElement);

            dayExpenses.forEach(expense => {
                const expenseElement = document.createElement('div');
                expenseElement.className = 'expense-item';
                const categoryIcon = this.getCategoryIcon(expense.category);
                expenseElement.innerHTML = `
                    <i class="${categoryIcon}"></i>
                    ${expense.category}: ₹${expense.amount.toFixed(2)}
                    ${expense.description ? `<br><small>${expense.description}</small>` : ''}
                `;
                dayElement.appendChild(expenseElement);
            });
        }

        return dayElement;
    }

    getCategoryIcon(category) {
        const icons = {
            food: 'fas fa-utensils',
            transport: 'fas fa-car',
            entertainment: 'fas fa-film',
            bills: 'fas fa-file-invoice-dollar',
            shopping: 'fas fa-shopping-bag',
            other: 'fas fa-ellipsis-h'
        };
        return icons[category] || 'fas fa-ellipsis-h';
    }

    isToday(date) {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    }

    getExpensesForDate(date) {
        return this.expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getDate() === date.getDate() &&
                   expenseDate.getMonth() === date.getMonth() &&
                   expenseDate.getFullYear() === date.getFullYear();
        });
    }

    handleExpenseSubmit(e) {
        e.preventDefault();
        
        const expense = {
            date: document.getElementById('expense-date').value,
            amount: parseFloat(document.getElementById('expense-amount').value),
            category: document.getElementById('expense-category').value,
            description: document.getElementById('expense-description').value || ''
        };

        this.expenses.push(expense);
        localStorage.setItem('expenses', JSON.stringify(this.expenses));

        this.expenseForm.reset();
        this.renderCalendar();
        this.updateMonthlySummary();
    }

    updateMonthlySummary() {
        const monthExpenses = this.expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === this.currentDate.getMonth() &&
                   expenseDate.getFullYear() === this.currentDate.getFullYear();
        });

        const total = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        this.totalExpensesElement.textContent = `₹${total.toFixed(2)}`;

        const categoryTotals = {};
        this.categories.forEach(category => {
            categoryTotals[category] = 0;
        });

        monthExpenses.forEach(expense => {
            categoryTotals[expense.category] += expense.amount;
        });

        this.categoryBreakdownElement.innerHTML = '';
        this.categories.forEach(category => {
            if (categoryTotals[category] > 0) {
                const categoryElement = document.createElement('div');
                categoryElement.className = 'category-item';
                categoryElement.innerHTML = `
                    <span><i class="${this.getCategoryIcon(category)}"></i> ${category.charAt(0).toUpperCase() + category.slice(1)}</span>
                    <span>₹${categoryTotals[category].toFixed(2)}</span>
                `;
                this.categoryBreakdownElement.appendChild(categoryElement);
            }
        });
    }
}

// Initialize the calendar when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new FinancialCalendar();
}); 