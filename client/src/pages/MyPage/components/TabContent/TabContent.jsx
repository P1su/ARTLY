import React from 'react';
import TabMyArtly from '../TabMyArtly/TabMyArtly';
import TabLike from '../TabLike/TabLike';
import TabPurchased from '../TabPurchased/TabPurchased';

export default function TabContent({ tab }) {
  switch (tab) {
    case 'My Artly':
      return <TabMyArtly />;
    case 'Like':
      return <TabLike />;
    case '구매 내역':
      return <TabPurchased />;

    default:
      return null;
  }
}
