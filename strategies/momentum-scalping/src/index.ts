import axios from 'axios';

async function main() {
  console.log('Hello from TypeScript Node.js app!');
  
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
    console.log('Sample API response:', response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

main();

