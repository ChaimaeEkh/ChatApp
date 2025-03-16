import React, { useState, useContext } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext';

const AvatarUploader = () => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(AuthContext);

  // Fonction pour convertir une image en base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;
        
        img.onload = () => {
          // Créer un canvas pour redimensionner l'image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Utiliser une taille fixe pour l'avatar
          const size = 150;
          canvas.width = size;
          canvas.height = size;
          
          // Calculer les dimensions pour un crop carré
          const minDimension = Math.min(img.width, img.height);
          const startX = (img.width - minDimension) / 2;
          const startY = (img.height - minDimension) / 2;
          
          // Dessiner une image carrée (crop au centre)
          ctx.drawImage(
            img, 
            startX, startY, minDimension, minDimension, // Source (crop)
            0, 0, size, size // Destination (redimensionnée)
          );
          
          // Convertir le canvas en base64
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          resolve(dataUrl);
        };
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Réinitialiser les états
    setError(null);
    setSuccess(false);
    
    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image');
      return;
    }
    
    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('La taille de l\'image ne doit pas dépasser 5MB');
      return;
    }
    
    try {
      // Afficher un aperçu
      setPreview(URL.createObjectURL(file));
    } catch (error) {
      console.error("Erreur lors de la création de l'aperçu:", error);
      setError("Impossible de prévisualiser l'image");
    }
  };
  
  const handleUpload = async () => {
    if (!preview) return;
    
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Récupérer le fichier à partir de l'input
      const fileInput = document.getElementById('avatar-upload');
      if (!fileInput.files[0]) {
        throw new Error("Aucun fichier sélectionné");
      }
      
      // Convertir en base64
      const base64Avatar = await convertToBase64(fileInput.files[0]);
      
      // Mettre à jour dans Firestore
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        avatar: base64Avatar
      });
      
      // Mise à jour réussie
      setSuccess(true);
      
      // Nettoyer la prévisualisation et l'input
      URL.revokeObjectURL(preview);
      fileInput.value = '';
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'avatar:", err);
      setError("Impossible de mettre à jour l'avatar. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    setPreview(null);
    setError(null);
    setSuccess(false);
    
    // Nettoyer l'input file
    const fileInput = document.getElementById('avatar-upload');
    if (fileInput) fileInput.value = '';
    
    // Libérer l'URL de prévisualisation
    if (preview) {
      URL.revokeObjectURL(preview);
    }
  };

  return (
    <div className="avatar-uploader" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '15px',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      margin: '20px 0'
    }}>
      <h3>Changer votre avatar</h3>
      
      {/* Prévisualisation de l'avatar */}
      <div className="avatar-preview" style={{
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        overflow: 'hidden',
        border: '2px solid #ddd',
        position: 'relative'
      }}>
        {preview ? (
          <img 
            src={preview} 
            alt="Avatar preview" 
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            color: '#888',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            <span>Sélectionnez une image</span>
          </div>
        )}
      </div>
      
      {/* Input pour sélectionner un fichier */}
      <div style={{marginTop: '10px', width: '100%'}}>
        <input
          type="file"
          id="avatar-upload"
          accept="image/*"
          onChange={handleFileChange}
          style={{display: 'none'}}
          disabled={loading}
        />
        <label 
          htmlFor="avatar-upload"
          style={{
            display: 'inline-block',
            padding: '8px 15px',
            backgroundColor: '#4a76a8',
            color: 'white',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Choisir une image
        </label>
        
        {preview && (
          <>
            <button
              onClick={handleUpload}
              disabled={loading}
              style={{
                padding: '8px 15px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginRight: '10px'
              }}
            >
              {loading ? 'Mise à jour...' : 'Enregistrer'}
            </button>
            
            <button
              onClick={handleCancel}
              disabled={loading}
              style={{
                padding: '8px 15px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              Annuler
            </button>
          </>
        )}
      </div>
      
      {/* Affichage des messages d'erreur ou de succès */}
      {error && (
        <div style={{
          padding: '10px',
          backgroundColor: '#ffebee',
          color: '#c62828',
          borderRadius: '4px',
          marginTop: '10px',
          width: '100%'
        }}>
          {error}
        </div>
      )}
      
      {success && (
        <div style={{
          padding: '10px',
          backgroundColor: '#e8f5e9',
          color: '#2e7d32',
          borderRadius: '4px',
          marginTop: '10px',
          width: '100%'
        }}>
          Avatar mis à jour avec succès!
        </div>
      )}
      
      <div style={{fontSize: '12px', color: '#666', marginTop: '10px', textAlign: 'center'}}>
        L'image sera recadrée en carré et redimensionnée. Formats recommandés: JPG, PNG. Taille max: 5MB.
      </div>
    </div>
  );
};

export default AvatarUploader;