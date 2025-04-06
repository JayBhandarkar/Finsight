// API Configuration
const API_KEY = 'YOUR_ALPHA_VANTAGE_API_KEY'; // You'll need to get this from https://www.alphavantage.co/
const BASE_URL = 'https://www.alphavantage.co/query';
let trackedStocks = new Set();
let searchTimeout;

// DOM Elements
const stockInput = document.getElementById('stockInput');
const addStockBtn = document.getElementById('addStock');
const stocksList = document.getElementById('stocksList');
const suggestionsDropdown = document.getElementById('suggestions');

// Event Listeners
addStockBtn.addEventListener('click', addStock);
stockInput.addEventListener('input', handleSearchInput);
stockInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addStock();
    }
});

// Functions
async function handleSearchInput(e) {
    const query = e.target.value.trim().toUpperCase();
    
    if (query.length > 0) {
        suggestionsDropdown.classList.add('show');
    } else {
        suggestionsDropdown.classList.remove('show');
        return;
    }

    clearTimeout(searchTimeout);
    
    if (query.length < 2) {
        suggestionsDropdown.innerHTML = '<div class="suggestion-item">Type at least 2 characters...</div>';
        return;
    }

    suggestionsDropdown.innerHTML = '<div class="suggestion-item loading">Searching...</div>';

    searchTimeout = setTimeout(async () => {
        try {
            const response = await fetch(`${BASE_URL}?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(query)}&apikey=${API_KEY}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.bestMatches && data.bestMatches.length > 0) {
                const filteredMatches = data.bestMatches
                    .filter(match => match['3. type'] === 'Equity')
                    .map(match => ({
                        '1. symbol': match['1. symbol'],
                        '2. name': match['2. name'],
                        '3. type': match['3. type'],
                        '4. region': match['4. region']
                    }));
                
                if (filteredMatches.length > 0) {
                    displaySuggestions(filteredMatches);
                } else {
                    suggestionsDropdown.innerHTML = '<div class="suggestion-item">No equity stocks found for "' + query + '"</div>';
                }
            } else {
                suggestionsDropdown.innerHTML = '<div class="suggestion-item">No results found for "' + query + '"</div>';
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            suggestionsDropdown.innerHTML = '<div class="suggestion-item error">Error loading results. Please try again.</div>';
        }
    }, 300);
}

function displaySuggestions(matches) {
    suggestionsDropdown.innerHTML = matches.map(match => `
        <div class="suggestion-item" data-symbol="${match['1. symbol']}">
            <span class="symbol">${match['1. symbol']}</span>
            <span class="name">${match['2. name']}</span>
            <span class="region">${match['4. region']}</span>
        </div>
    `).join('');

    // Add click event listeners to suggestions
    suggestionsDropdown.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
            const symbol = item.getAttribute('data-symbol');
            stockInput.value = symbol;
            suggestionsDropdown.classList.remove('show');
        });
    });
}

async function addStock() {
    const symbol = stockInput.value.trim().toUpperCase();
    
    if (!symbol) {
        showNotification('Please enter a stock symbol', 'error');
        return;
    }
    
    if (trackedStocks.has(symbol)) {
        showNotification('Stock already being tracked', 'error');
        return;
    }

    try {
        const stockData = await fetchStockData(symbol);
        if (stockData) {
            trackedStocks.add(symbol);
            createStockCard(stockData);
            stockInput.value = '';
            suggestionsDropdown.classList.remove('show');
            showNotification('Stock added successfully', 'success');
        }
    } catch (error) {
        showNotification('Error adding stock. Please try again.', 'error');
    }
}

async function fetchStockData(symbol) {
    try {
        const response = await fetch(`${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data['Global Quote']) {
            const quote = data['Global Quote'];
            const currentPrice = parseFloat(quote['05. price']);
            const previousClose = parseFloat(quote['08. previous close']);
            const change = currentPrice - previousClose;
            const changePercent = ((change / previousClose) * 100).toFixed(2) + '%';
            
            return {
                symbol: symbol,
                name: stockInput.value,
                price: currentPrice,
                change: change,
                changePercent: changePercent,
                high: parseFloat(quote['03. high']),
                low: parseFloat(quote['04. low']),
                volume: parseInt(quote['06. volume']),
                currency: 'USD' // Alpha Vantage returns prices in USD
            };
        } else {
            throw new Error('Invalid API response');
        }
    } catch (error) {
        console.error('Error fetching stock data:', error);
        showNotification('Error connecting to the API. Please try again.', 'error');
        return null;
    }
}

function createStockCard(stock) {
    const card = document.createElement('div');
    card.className = 'stock-card';
    card.id = `stock-${stock.symbol}`;
    
    const priceClass = stock.change >= 0 ? 'price-up' : 'price-down';
    const changeSign = stock.change >= 0 ? '+' : '';
    const currencySymbol = stock.currency === 'USD' ? '$' : '₹';
    
    card.innerHTML = `
        <div class="stock-header">
            <h3>${stock.name}</h3>
            <span class="stock-symbol">${stock.symbol}</span>
        </div>
        <div class="stock-price ${priceClass}">${currencySymbol}${stock.price.toFixed(2)}</div>
        <div class="stock-detail">
            <span class="${priceClass}">${changeSign}${stock.change.toFixed(2)} (${stock.changePercent})</span>
        </div>
        <div class="stock-info">
            <div>High: ${currencySymbol}${stock.high.toFixed(2)}</div>
            <div>Low: ${currencySymbol}${stock.low.toFixed(2)}</div>
            <div>Volume: ${stock.volume.toLocaleString()}</div>
        </div>
        <button class="remove-btn" onclick="removeStock('${stock.symbol}')">×</button>
    `;
    
    stocksList.appendChild(card);
}

function removeStock(symbol) {
    trackedStocks.delete(symbol);
    const card = document.getElementById(`stock-${symbol}`);
    if (card) {
        card.style.transform = 'scale(0.95)';
        card.style.opacity = '0';
        setTimeout(() => {
            card.remove();
            showNotification('Stock removed successfully', 'success');
        }, 300);
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Update stock prices every minute
setInterval(async () => {
    for (const symbol of trackedStocks) {
        try {
            const stockData = await fetchStockData(symbol);
            if (stockData) {
                const card = document.getElementById(`stock-${symbol}`);
                if (card) {
                    const priceElement = card.querySelector('.stock-price');
                    const changeElement = card.querySelector('.stock-detail span');
                    
                    const priceClass = stockData.change >= 0 ? 'price-up' : 'price-down';
                    const changeSign = stockData.change >= 0 ? '+' : '';
                    const currencySymbol = stockData.currency === 'USD' ? '$' : '₹';
                    
                    priceElement.classList.add('paused');
                    priceElement.style.transform = 'scale(1.1)';
                    
                    setTimeout(() => {
                        priceElement.className = `stock-price ${priceClass}`;
                        priceElement.textContent = `${currencySymbol}${stockData.price.toFixed(2)}`;
                        priceElement.style.transform = 'scale(1)';
                        
                        setTimeout(() => {
                            priceElement.classList.remove('paused');
                        }, 1000);
                    }, 150);
                    
                    changeElement.className = priceClass;
                    changeElement.textContent = `${changeSign}${stockData.change.toFixed(2)} (${stockData.changePercent})`;
                }
            }
        } catch (error) {
            console.error(`Error updating ${symbol}:`, error);
        }
    }
}, 60000); 