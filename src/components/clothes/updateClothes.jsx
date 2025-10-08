import {URL} from "../../config"; 

const updateClothes = async (type, id, updatedData) => {
  try {
    const response = await fetch(`${URL}/clothing/${type}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { error: 'Failed to update item' };
  }
};

export default updateClothes;
