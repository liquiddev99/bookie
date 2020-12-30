import React from "react";

import Book from "./Book";

const Feature = () => {
  return (
    <div className="feature">
      <div className="feature__title">
        <h2 className="feature__title--h2">Featured Product</h2>
        <p className="feature__title--para">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry
        </p>
      </div>
      <div className="feature__list">
        <Book
          src="https://cdn0.fahasa.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/k/h/khi-hikaru-c_n-tr_n_1.jpg"
          title="Khi Hikaru còn trên thế gian này"
          price={63}
          old_price={90}
          id="5f91cb78bb0173579065372f"
        />
        <Book
          src="https://cdn0.fahasa.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/k/h/khi-hikaru-c_n-tr_n_1.jpg"
          title="Khi Hikaru còn trên thế gian này"
          price={63}
          old_price={90}
          id="5f91cb78bb0173579065372f"
        />
        <Book
          src="https://cdn0.fahasa.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/k/h/khi-hikaru-c_n-tr_n_1.jpg"
          title="Khi Hikaru còn trên thế gian này"
          price={63}
          old_price={90}
          id="5f91cb78bb0173579065372f"
        />
        <Book
          src="https://cdn0.fahasa.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/k/h/khi-hikaru-c_n-tr_n_1.jpg"
          title="Khi Hikaru còn trên thế gian này"
          price={63}
          old_price={90}
          id="5f91cb78bb0173579065372f"
        />
      </div>
    </div>
  );
};

export default Feature;
