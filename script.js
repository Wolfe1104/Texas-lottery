 // Current top hot numbers as of December 2025 (from official texaslottery.com frequency chart)
const hotNumbers = [4, 8, 26, 31, 38, 39, 49, 15, 19, 27]; // Top 10 most frequent

function getWeightedNumber() {
    // 50% chance to pick from hot numbers (adjustable)
    if (Math.random() < 0.5) {
        return hotNumbers[Math.floor(Math.random() * hotNumbers.length)];
    }
    return Math.floor(Math.random() * 54) + 1;
}

function getRandomNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        let num = getWeightedNumber();
        numbers.add(num);
    }
    return Array.from(numbers).sort((a, b) => a - b);
}

function generateNumbers() {
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
        `Algorithm weighted toward current hottest numbers: ${hotNumbers.join(', ')}`;
}
