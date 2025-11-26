export const item_allocation = async (obj) => {
  try {
    const response = await fetch('http://localhost:4004/item_allocation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData)
      throw new Error(`Error ${response.status}: ${errorData.msg || 'Unknown error'}`);
    }

    return await response.json();
  } catch (error) {
    // console.error('Error during allocation:', error);
    throw new Error(`Allocation failed: ${error.message}`); // Re-throw with custom message
  }
};
