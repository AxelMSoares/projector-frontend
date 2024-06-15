import React, { useState, useEffect } from 'react';
import { uploadImage } from '../../api/uploadImage';
import { deleteImage } from '../../api/deleteImage';
import { useCSRFToken } from '../../context/CSRFTokenContext';

export default function ProfileImageUpload({ onImageUpload, user, jwt }) {

  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [userHasImage, setUserHasImage] = useState(false);
  const csrfToken = useCSRFToken();

  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
    }
      , 5000);
    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    checkIfUserHasImage(user);
  }, [user]);

  function checkIfUserHasImage(user) {
    if (user.profilePicture !== null) {
      setImagePreview(user.profilePicture);
      setImageUrl(user.profilePicture);
      setUserHasImage(true);
    }
  }

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

      const response = await uploadImage(image, jwt, csrfToken);

      if (response.message === 'Image uploaded successfully') {
        onImageUpload(response.imageUrl);
        setImagePreview(response.imageUrl);
        setImageUrl(response.imageUrl);
        setUserHasImage(true);
        setError({ content: 'Image téléchargée avec succès', class: 'success' });
      }
    }
  }

  async function handleDelete(jwt, user) {
    if (userHasImage === false) {
      setError({ content: 'Aucune image à supprimer', class: 'error' });
      return;
    }

    const imageName = imageUrl.split('/').pop();

    // Delete the image
    const response = await deleteImage(jwt, csrfToken, imageName);

    if (response.message === 'Image deleted successfully') {
      onImageUpload(null);
      setUserHasImage(false);
      setImagePreview(null);
      setError({ content: 'Image supprimée avec succès', class: 'success' });
    }
  }

  return (
    <div className='image-field'>
      {userHasImage ?
        <>
          {error && <p className={error.class}>{error.content}</p>}
          <img src={imagePreview} />
          <button className="delete-picture-btn" onClick={() => handleDelete(jwt, user)}>Supprimer image</button>

        </> :
        <>
          <input
            type="file"
            accept='image/jpeg, image/png'
            onChange={(e) => {
              setImagePreview(URL.createObjectURL(e.target.files[0]));
              setImage(e.target.files[0]);
            }}
          />
          {imagePreview && <div className='image-preview'><p>Prévisualiser l'image:</p><img src={imagePreview} /></div>}
          {error && <p className={error.class}>{error.content}</p>}
          {imagePreview && <button className="upload-btn" onClick={handleUpload}>Upload</button>}
        </>
      }
    </div>
  );
};