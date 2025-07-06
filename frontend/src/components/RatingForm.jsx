import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { getUserId } from '../utils/auth';

const RatingStars = ({ storeId, rating_boutiques, isInteractive = false, onStarClick, currentRating }) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const { t } = useTranslation();

  const averageRating = rating_boutiques?.length > 0
    ? rating_boutiques.reduce((acc, curr) => acc + curr.stars, 0) / rating_boutiques.length
    : 0;

  return (
    <div className="inline-block">
      {[1, 2, 3, 4, 5].map((rating) => (
        <div key={rating} className="inline-block">
          <input
            type="radio"
            id={`star${rating}-${storeId}`}
            name={`rating-${storeId}`}
            value={rating}
            className="hidden"
            checked={isInteractive ? currentRating === rating : averageRating >= rating}
            onChange={() => onStarClick(rating)}
          />
          <label
            htmlFor={`star${rating}-${storeId}`}
            className={`float-right cursor-pointer text-2xl transition-colors duration-300 ${
              isInteractive 
                ? (hoveredRating >= rating || currentRating >= rating ? 'text-purple-600' : 'text-gray-300')
                : (averageRating >= rating ? 'text-purple-600' : 'text-gray-300')
            }`}
            onMouseEnter={() => isInteractive ? setHoveredRating(rating) : null}
            onMouseLeave={() => isInteractive ? setHoveredRating(0) : null}
            onClick={() => onStarClick(rating)}
          >
            ★
          </label>
        </div>
      ))}
    </div>
  );
};

const RatingForm = ({ 
  showModal, 
  onClose, 
  selectedStore, 
  onRatingSubmit,
  existingRating 
}) => {
  const { t } = useTranslation();
  const [ratingForm, setRatingForm] = useState({
    stars: existingRating?.stars || 0,
    opinion: existingRating?.opinion || ''
  });
  const [isRating, setIsRating] = useState(false);

  useEffect(() => {
    if (existingRating) {
      setRatingForm({
        stars: existingRating.stars,
        opinion: existingRating.opinion || ''
      });
    } else {
      setRatingForm({
        stars: 0,
        opinion: ''
      });
    }
  }, [existingRating]);

  const handleStarClick = (rating) => {
    setRatingForm(prev => ({ ...prev, stars: rating }));
  };

  const handleSubmit = async () => {
    try {
      setIsRating(true);
      const userId = getUserId();
      
      if (!userId) {
        toast.error(t('stores.ratingForm.loginRequired'));
        return;
      }

      await onRatingSubmit(selectedStore.id, ratingForm.stars, ratingForm.opinion);
      onClose();
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error(t('stores.ratingForm.error'));
    } finally {
      setIsRating(false);
    }
  };

  if (!showModal || !selectedStore) return null;

  return (
    <div className="fixed inset-0 bg-[#1e3a8a]/40 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            {existingRating ? t('stores.ratingForm.updateTitle') : t('stores.ratingForm.title')} {selectedStore.nom}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {existingRating && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">{t('stores.ratingForm.previousRating')}</p>
            <div className="flex items-center gap-2">
              <RatingStars 
                storeId={selectedStore.id} 
                rating_boutiques={[existingRating]}
                isInteractive={false}
              />
              <span className="text-sm text-gray-600">
                {existingRating.stars} {existingRating.stars === 1 ? t('stores.ratingForm.star') : t('stores.ratingForm.stars')}
              </span>
            </div>
            {existingRating.opinion && (
              <p className="mt-2 text-sm text-gray-600 italic">
                "{existingRating.opinion}"
              </p>
            )}
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('stores.ratingForm.yourRating')}</label>
          <div className="flex items-center gap-2">
            <RatingStars 
              storeId={selectedStore.id} 
              rating_boutiques={[]}
              isInteractive={true}
              onStarClick={handleStarClick}
              currentRating={ratingForm.stars}
            />
            {ratingForm.stars > 0 && (
              <span className="text-sm text-gray-600">
                {ratingForm.stars} {ratingForm.stars === 1 ? t('stores.ratingForm.star') : t('stores.ratingForm.stars')}
              </span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('stores.ratingForm.yourOpinion')}</label>
          <textarea
            value={ratingForm.opinion}
            onChange={(e) => setRatingForm(prev => ({ ...prev, opinion: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-purple-500"
            rows="4"
            placeholder={t('stores.ratingForm.opinionPlaceholder')}
            required
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!ratingForm.stars || !ratingForm.opinion || isRating}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isRating ? t('stores.ratingForm.submitting') : existingRating ? t('stores.ratingForm.update') : t('stores.ratingForm.submit')}
        </button>
      </div>
    </div>
  );
};

export default RatingForm; 