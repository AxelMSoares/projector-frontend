import React, { useState, useEffect } from 'react';
import { uploadImage } from '../../api/uploadImage';

export default function ProfileImageUpload({onImageUpload}) {

  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setError(null);
    }
    , 5000);
  }, [error]);


  async function handleUpload() {

    if (image) {
      // If the image size is bigger than 2MB, return
      if (image.size > 2000000) {
        setError({ content: 'Image trop grande. L\'image doit faire moins de 2Mb.', class: 'error' });
        return;
      }

      // If the image type its not jpeg or png, return
      if (!['image/jpeg', 'image/png'].includes(image.type)) {
        setError({ content: 'Le format de l\'image doit être jpeg ou png', class: 'error' });
        return;
      }

      // If the image is valid
      setError(null);

      const response = await uploadImage(image);
      setImageUrl(response.imageUrl);

      if(response.message === 'Image uploaded'){
        setError({ content: 'Image téléchargée avec succès', class: 'success' });
        setImagePreview(null);
        onImageUpload(imageUrl);
      }

    }
  }

  return (
    <div className='image-field'>
      {imagePreview && <div className='image-preview'><p>Prévisualiser l'image:</p><img src={imagePreview} /></div>}
      <input
        type="file"
        accept='image/jpeg, image/png'
        onChange={(e) => {
          setImagePreview(URL.createObjectURL(e.target.files[0]));
          setImage(e.target.files[0]);
        }}
      />
      {imagePreview && <button onClick={handleUpload}>Upload</button>}
      {error && <p className={error.class}>{error.content}</p>}
    </div>
  );
};