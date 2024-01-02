import React from 'react';
import Card from '../components/Card';

type CardCollectionProps = { 
  cardData: string;
  displayWide: boolean;  
};

function CardCollection({cardData, displayWide}: CardCollectionProps) {

  let tailwindColumns = 'lg:grid-cols-2 2xl:grid-cols-3';

  if (displayWide) {
    tailwindColumns = 'lg:grid-cols-3 2xl:grid-cols-4';
  }

  return (
    <section className={`grid gap-8 ${tailwindColumns}`}>
      {cardData.map(cd => {
        return (
          <Card
            cardHeader={cd.cardHeader}
            cardLink={cd.cardLink}
            cardEmoji={cd.cardEmoji}
            cardContent={cd.cardContent}
            displayWide={displayWide} 
          />
        );
      })}
    </section>
  );
}

export default CardCollection;
