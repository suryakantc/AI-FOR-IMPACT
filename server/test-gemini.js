require('dotenv').config();

async function test() {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await res.json();
    if (data.models) {
      console.log('Available models:');
      data.models.forEach(m => {
        if (m.name.includes('gemini')) {
          console.log(`- ${m.name}`);
        }
      });
    } else {
      console.log('No models list in response:', data);
    }
  } catch (err) {
    console.error('Failed:', err.message);
  }
}

test();
