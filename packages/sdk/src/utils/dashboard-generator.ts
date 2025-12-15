import { PlaceOrderData } from "./writer";

export function generateDashboardHTML(data: PlaceOrderData[]): string {
  // Escape JSON for embedding in HTML
  const dataJson = JSON.stringify(data).replace(/</g, "\\u003c");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Trading Activity Dashboard</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .stat-card h3 {
      font-size: 0.875rem;
      opacity: 0.9;
      margin-bottom: 0.5rem;
    }
    .stat-card .value {
      font-size: 2rem;
      font-weight: bold;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th {
      background-color: #f3f4f6;
      padding: 0.75rem;
      text-align: left;
      font-weight: 600;
      cursor: pointer;
      user-select: none;
      position: relative;
    }
    th:hover {
      background-color: #e5e7eb;
    }
    td {
      padding: 0.75rem;
      border-bottom: 1px solid #e5e7eb;
    }
    tr:hover {
      background-color: #f9fafb;
    }
    .profit {
      color: #10b981;
    }
    .loss {
      color: #ef4444;
    }
    .sort-caret {
      display: inline-block;
      margin-left: 0.5rem;
      width: 0;
      height: 0;
      opacity: 0.4;
      transition: opacity 0.2s;
    }
    .sort-caret.active {
      opacity: 1;
    }
    .sort-caret.up {
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-bottom: 6px solid #374151;
    }
    .sort-caret.down {
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 6px solid #374151;
    }
    .sort-caret.neutral {
      border-left: 3px solid transparent;
      border-right: 3px solid transparent;
      border-top: 3px solid transparent;
      border-bottom: 3px solid transparent;
      border-left-color: #9ca3af;
      border-right-color: #9ca3af;
      width: 0;
      height: 6px;
      border-style: solid;
      border-width: 3px 0;
    }
    .company-analysis-item {
      margin-bottom: 1.5rem;
    }
    .company-analysis-header {
      cursor: pointer;
      padding: 1rem;
      background-color: #f9fafb;
      border-radius: 0.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: background-color 0.2s;
    }
    .company-analysis-header:hover {
      background-color: #f3f4f6;
    }
    .company-analysis-content {
      display: none;
      padding: 1rem;
      background-color: white;
      border-radius: 0 0 0.5rem 0.5rem;
    }
    .company-analysis-content.expanded {
      display: block;
    }
    .depth-table {
      margin-top: 1rem;
      font-size: 0.875rem;
    }
    .depth-table th,
    .depth-table td {
      padding: 0.5rem;
      text-align: right;
    }
    .depth-table th:first-child,
    .depth-table td:first-child {
      text-align: left;
    }
  </style>
</head>
<body class="bg-gray-50">
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8 text-gray-800">Trading Activity Dashboard</h1>
    
    <!-- Orders Placed Table (Primary Focus) -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-semibold text-gray-700">Orders Placed</h2>
        <input 
          type="text" 
          id="symbolFilter" 
          placeholder="Filter by symbol..." 
          class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
      </div>
      <div class="overflow-x-auto">
        <table id="stockTable">
          <thead>
            <tr>
              <th onclick="sortTable(0)">Symbol<span class="sort-caret" id="sort-0"></span></th>
              <th onclick="sortTable(1)">Instrument<span class="sort-caret" id="sort-1"></span></th>
              <th onclick="sortTable(2)">Entry Price<span class="sort-caret" id="sort-2"></span></th>
              <th onclick="sortTable(3)">Current Price<span class="sort-caret" id="sort-3"></span></th>
              <th onclick="sortTable(4)">Stop Loss<span class="sort-caret" id="sort-4"></span></th>
              <th onclick="sortTable(5)">Take Profit<span class="sort-caret" id="sort-5"></span></th>
              <th onclick="sortTable(6)">Buyer Control %<span class="sort-caret" id="sort-6"></span></th>
              <th onclick="sortTable(7)">Timestamp<span class="sort-caret" id="sort-7"></span></th>
            </tr>
          </thead>
          <tbody id="stockTableBody"></tbody>
        </table>
      </div>
    </div>

    <!-- Summary Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8" id="summaryStats"></div>
    
    <!-- Company Analysis Section -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 class="text-2xl font-semibold mb-4 text-gray-700">Company Analysis</h2>
      <div id="companyAnalysis"></div>
    </div>
  </div>

  <script>
    const data = ${dataJson};
    
    let sortColumn = -1;
    let sortDirection = 1;
    let filteredData = [...data];
    
    // Calculate summary statistics
    function calculateStats() {
      if (data.length === 0) return null;
      
      const totalOrders = data.length;
      const avgEntryPrice = data.reduce((sum, d) => sum + d.entryPrice, 0) / totalOrders;
      
      return {
        totalOrders,
        avgEntryPrice
      };
    }
    
    // Render summary statistics
    function renderStats() {
      const stats = calculateStats();
      if (!stats) return;
      
      const statsHtml = \`
        <div class="stat-card">
          <h3>Total Orders</h3>
          <div class="value">\${stats.totalOrders}</div>
        </div>
        <div class="stat-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
          <h3>Avg Entry Price</h3>
          <div class="value">₹\${stats.avgEntryPrice.toFixed(2)}</div>
        </div>
      \`;
      
      document.getElementById('summaryStats').innerHTML = statsHtml;
    }
    
    // Update sort caret icons
    function updateSortCarets() {
      for (let i = 0; i < 8; i++) {
        const caret = document.getElementById(\`sort-\${i}\`);
        if (i === sortColumn) {
          caret.className = \`sort-caret active \${sortDirection === 1 ? 'up' : 'down'}\`;
        } else {
          caret.className = 'sort-caret neutral';
        }
      }
    }
    
    // Render Stock Table
    function renderTable() {
      const tbody = document.getElementById('stockTableBody');
      tbody.innerHTML = '';
      
      filteredData.forEach((stock, index) => {
        const timestamp = new Date(stock.timestamp).toLocaleString();
        
        const row = document.createElement('tr');
        row.setAttribute('data-index', index.toString());
        row.style.cursor = 'pointer';
        
        row.innerHTML = \`
          <td>\${stock.nseSymbol}</td>
          <td>\${stock.instrument}</td>
          <td>₹\${stock.entryPrice.toFixed(2)}</td>
          <td>₹\${stock.currentPrice.toFixed(2)}</td>
          <td>₹\${stock.stopLossPrice.toFixed(2)}</td>
          <td>₹\${stock.takeProfitPrice.toFixed(2)}</td>
          <td>\${stock.buyerControlOfStockPercentage.toFixed(2)}%</td>
          <td>\${timestamp}</td>
        \`;
        
        tbody.appendChild(row);
      });
      
      updateSortCarets();
    }
    
    // Sort table
    function sortTable(column) {
      if (sortColumn === column) {
        sortDirection *= -1;
      } else {
        sortColumn = column;
        sortDirection = 1;
      }
      
      filteredData.sort((a, b) => {
        let aVal, bVal;
        
        switch(column) {
          case 0: aVal = a.nseSymbol; bVal = b.nseSymbol; break;
          case 1: aVal = a.instrument; bVal = b.instrument; break;
          case 2: aVal = a.entryPrice; bVal = b.entryPrice; break;
          case 3: aVal = a.currentPrice; bVal = b.currentPrice; break;
          case 4: aVal = a.stopLossPrice; bVal = b.stopLossPrice; break;
          case 5: aVal = a.takeProfitPrice; bVal = b.takeProfitPrice; break;
          case 6: aVal = a.buyerControlOfStockPercentage; bVal = b.buyerControlOfStockPercentage; break;
          case 7: aVal = new Date(a.timestamp).getTime(); bVal = new Date(b.timestamp).getTime(); break;
          default: return 0;
        }
        
        if (typeof aVal === 'string') {
          return sortDirection * aVal.localeCompare(bVal);
        }
        return sortDirection * (aVal - bVal);
      });
      
      renderTable();
    }
    
    // Filter table
    document.getElementById('symbolFilter').addEventListener('input', (e) => {
      const filter = e.target.value.toLowerCase();
      filteredData = data.filter(d => 
        d.nseSymbol.toLowerCase().includes(filter) || 
        d.instrument.toLowerCase().includes(filter)
      );
      renderTable();
      renderCompanyAnalysis();
    });
    
    // Render Company Analysis
    function renderCompanyAnalysis() {
      const container = document.getElementById('companyAnalysis');
      container.innerHTML = '';
      
      if (filteredData.length === 0) {
        container.innerHTML = '<p class="text-gray-500">No data available</p>';
        return;
      }
      
      // Calculate summary statistics
      const totalBuyDepth = filteredData.reduce((sum, d) => 
        sum + d.buyDepth.slice(0, 5).reduce((s, level) => s + level.quantity, 0), 0
      );
      const totalSellDepth = filteredData.reduce((sum, d) => 
        sum + d.sellDepth.slice(0, 5).reduce((s, level) => s + level.quantity, 0), 0
      );
      const avgBuyDepth = totalBuyDepth / filteredData.length;
      const avgSellDepth = totalSellDepth / filteredData.length;
      const totalDepth = totalBuyDepth + totalSellDepth;
      const buyerControlPercentage = totalDepth > 0 ? (totalBuyDepth / totalDepth * 100).toFixed(2) : 0;
      
      // Summary stats
      const summaryHtml = \`
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="text-sm text-gray-600 mb-1">Total Companies</h3>
            <div class="text-2xl font-bold text-gray-800">\${filteredData.length}</div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="text-sm text-gray-600 mb-1">Avg Buy Depth</h3>
            <div class="text-2xl font-bold text-gray-800">\${avgBuyDepth.toLocaleString()}</div>
          </div>
          <div class="bg-red-50 p-4 rounded-lg">
            <h3 class="text-sm text-gray-600 mb-1">Avg Sell Depth</h3>
            <div class="text-2xl font-bold text-gray-800">\${avgSellDepth.toLocaleString()}</div>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg">
            <h3 class="text-sm text-gray-600 mb-1">Buyer Control</h3>
            <div class="text-2xl font-bold text-gray-800">\${buyerControlPercentage}%</div>
          </div>
        </div>
      \`;
      
      container.innerHTML = summaryHtml;
      
      // Individual company details
      const detailsContainer = document.createElement('div');
      detailsContainer.className = 'space-y-4';
      
      filteredData.forEach((stock, index) => {
        const item = document.createElement('div');
        item.className = 'company-analysis-item border border-gray-200 rounded-lg';
        
        const buyDepthTop5 = stock.buyDepth.slice(0, 5);
        const sellDepthTop5 = stock.sellDepth.slice(0, 5);
        
        item.innerHTML = \`
          <div class="company-analysis-header" onclick="toggleCompanyDetails(\${index})">
            <div>
              <h3 class="font-semibold text-gray-800">\${stock.nseSymbol}</h3>
              <p class="text-sm text-gray-600">\${stock.instrument}</p>
            </div>
            <div class="text-right">
              <div class="text-sm font-semibold text-gray-800">Buyer Control</div>
              <div class="text-lg font-bold text-blue-600">\${stock.buyerControlOfStockPercentage.toFixed(2)}%</div>
            </div>
            <span class="text-gray-400" id="toggle-\${index}">▼</span>
          </div>
          <div class="company-analysis-content" id="details-\${index}">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 class="font-semibold text-green-700 mb-2">Buy Depth (Top 5)</h4>
                <table class="depth-table">
                  <thead>
                    <tr>
                      <th>Level</th>
                      <th>Price</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    \${buyDepthTop5.map((level, i) => \`
                      <tr>
                        <td>\${i + 1}</td>
                        <td>₹\${level.price.toFixed(2)}</td>
                        <td>\${level.quantity.toLocaleString()}</td>
                      </tr>
                    \`).join('')}
                  </tbody>
                </table>
              </div>
              <div>
                <h4 class="font-semibold text-red-700 mb-2">Sell Depth (Top 5)</h4>
                <table class="depth-table">
                  <thead>
                    <tr>
                      <th>Level</th>
                      <th>Price</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    \${sellDepthTop5.map((level, i) => \`
                      <tr>
                        <td>\${i + 1}</td>
                        <td>₹\${level.price.toFixed(2)}</td>
                        <td>\${level.quantity.toLocaleString()}</td>
                      </tr>
                    \`).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        \`;
        
        detailsContainer.appendChild(item);
      });
      
      container.appendChild(detailsContainer);
    }
    
    // Toggle company details
    function toggleCompanyDetails(index) {
      const content = document.getElementById(\`details-\${index}\`);
      const toggle = document.getElementById(\`toggle-\${index}\`);
      
      if (content.classList.contains('expanded')) {
        content.classList.remove('expanded');
        toggle.textContent = '▼';
      } else {
        content.classList.add('expanded');
        toggle.textContent = '▲';
      }
    }
    
    // Make toggleCompanyDetails available globally
    window.toggleCompanyDetails = toggleCompanyDetails;
    
    // Initialize everything
    renderStats();
    renderTable();
    renderCompanyAnalysis();
  </script>
</body>
</html>`;
}









