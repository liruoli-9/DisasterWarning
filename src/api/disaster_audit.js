export const disaster_audit = async (obj) => {
  try {
    const response = await fetch('http://localhost:4004/disaster_audit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error ${response.status}: ${errorData.msg || 'Unknown error'}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error during registration:', error);
    throw error; // Re-throw the error for further handling
  }
};
