export const getAllUser = async () => {
  try {
    const response = await fetch('http://localhost:4004/getAllUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error during login:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
};