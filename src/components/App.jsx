import { useState, useEffect } from 'react';
import  Notiflix  from 'notiflix';

import  Searchbar from './Searchbar/Searchbar';

import { Loader } from './Loader/Loader';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import  Modal  from './Modal/Modal';
import { galleryApi } from 'services/gallery-api';

// import css from './app-module.css';



export default function App() {
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [img, setImg] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonTogle, setButtonTogle] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [currenPreview, setCurrenPreview] = useState('');
  const [totalImage, setTotalImage] = useState(0);

  useEffect(() => {
    if (!searchText) {
      return;
    }

    setIsLoading(true);

    galleryApi(searchText, page)
      .then(response => response.json())
      .then(data => {
        if (!data.total) {
          Notiflix.Notify.failure(
            'Sorry, but nothing was found for your search'
          );
        }

        setImg(prevImg => [...prevImg, ...data.hits]);
        setTotalImage(data.total);

        const hits = data.hits;
        buttonToglee(hits.length);
        console.log(page);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [searchText, page]);

  const openModal = url => {
    setCurrenPreview(url);
    setIsModal(true);
  };

  const modalClose = () => {
    setIsModal(false);
  };

  const handleSearch = (searchTextе) => {
    if (searchText.trim() === searchTextе) {
  return  Notiflix.Notify.warning("шось нове давай")
    }
    setSearchText(searchTextе);
    setImg([]);
    setPage(1);
  };

  const onLoadMore = () => {
    setPage(prevState => prevState + 1);
  };

  const buttonToglee = length => {
    if (length >= 4) {
      return setButtonTogle(true);
    }
      return setButtonTogle(false);
  };

  return (
    <>
      <Searchbar handleSearch={handleSearch} />

      {img.length !== 0 && <ImageGallery data={img} onImageClick={openModal} />}

      {isLoading && <Loader />}
      {img.length !== totalImage && buttonTogle && !isLoading && (
        <Button onLoadMore={onLoadMore} />
      )}
        {isModal && <Modal onModalClose={modalClose} image={currenPreview} />}
    </>
  );
}