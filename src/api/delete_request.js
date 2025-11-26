export const delete_request = async (request_Id) => {
  try {
    const response = await fetch('http://localhost:4004/delete_request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({request_Id})
      
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error during login:', error);
    throw error; 
  }
};