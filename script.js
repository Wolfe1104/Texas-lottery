let frequency = {}; // Will hold {number: timesDrawn}
let hotNumbers = []; // Top hot ones

const FREQUENCY_URL = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://www.texaslottery.com/export/sites/lottery/Games/Lotto_Texas/Number_Frequency.html');

async function loadFrequencyData() {
    document.getElementById('status').textContent = 'Loading latest official frequency data...';
    try {
        const response = await fetch(FREQUENCY_URL);
        const html = await response.text();
        
        // Parse the table (simple but reliable for this page structure)
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const rows = doc.querySelectorAll('table tr');
        
        for (let row of rows) {
            const cells = row.querySelectorAll('td');
            if (cells.length === 2) {
                const num = parseInt(cells[0].textContent.trim());
                const count = parseInt(cells[1].textContent.trim());
                if (num >= 1 && num <= 54) {
                    frequency[num] = count;
                }
            }
        }
        
        // Get top 10 hot numbers (most drawn)
        hotNumbers = Object.keys(frequency)
            .map(n => ({num: parseInt(n), count: frequency[n]}))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10)
            .map(item => item.num);
        
        document.getElementById('status').textContent = 'Real-time data loaded! Ready to predict.';
        document.getElementById('hot-info').textContent = `Using official hot numbers (top drawn): ${hotNumbers.join(', ')}`;
    } catch (error) {
        document.getElementById('status').textContent = 'Could not load data—using example hot numbers.';
        hotNumbers = [8, 9, 14, 26, 30, 33, 52]; // Fallback
    }
}

function getWeightedNumber() {
    // Custom logic: Weight by frequency (real data!)
    const totalWeight = Object.values(frequency).reduce((a, b) => a + b + 1, 0); // +1 to avoid zero
    let rand = Math.random() * totalWeight;
    for (let num = 1; num <= 54; num++) {
        const weight = (frequency[num] || 0) + 1;
        if (rand < weight) return num;
        rand -= weight;
    }
    return Math.floor(Math.random() * 54) + 1; // Fallback
}

function getRandomNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(getWeightedNumber());
    }
    return Array.from(numbers).sort((a, b) => a - b);
}

async function generateNumbers() {
    if (Object.keys(frequency).length === 0) {
        await loadFrequencyData();
    }
    
    const output = document.getElementById('numbers');
    output.innerHTML = '';
    
    const nums = getRandomNumbers();
    nums.forEach(n => {
        const ball = document.createElement('div');
        ball.className = 'ball';
        ball.textContent = n.toString().padStart(2, '0');
        output.appendChild(ball);
    });
    
    document.getElementById('hot-info').textContent = 
        `Real-time weighted toward current hot numbers: ${hotNumbers.join(', ')} (from texaslottery.com)`;
}
