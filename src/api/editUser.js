export const edituser = async (obj) => {
  console.log(obj)
  try {
    const response = await fetch('http://localhost:4004/editinfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    });

    if (!response.ok) {
      // 处理响应体中的错误信息
      const errorData = await response.json();
      const errorMessage = errorData.msg || 'Network response was not ok';
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('修改时出现错误', error.message);
    // 提供用户友好的错误提示
    throw error
  }
};
