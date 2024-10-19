import React from 'react';
import './bookpreloader.css';

const BookPreloader = () => {
  return (
    <div className="book-preloader">
      <div className="book">
        <div className="book-page"></div>
        <div className="book-page"></div>
        <div className="book-page"></div>
      </div>
    </div>
  );
};

export default BookPreloader;
