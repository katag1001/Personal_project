
import {URL} from "../../config"; 

const deleteClothes = async (type, id) => {
  try {
    const response = await fetch(`${URL}/clothing/${type}/${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { error: 'Failed to delete item' };
  }
};

export default deleteClothes;
