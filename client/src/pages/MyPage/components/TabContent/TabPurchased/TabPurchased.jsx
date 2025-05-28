import React, { useEffect, useState } from 'react';
import SectionTitle from '../../SectionTitle/SectionTitle';
import dummyImg from '../../../mock/dummyImg.png';
import SectionCatalog from '../../Sections/SectionCatalog/SectionCatalog';
import { instance } from '../../../../../apis/instance';

export default function TabPurchased() {
  const [purchased, setPurchased] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const purchaseRes = await instance.get('/api/users/me/purchases');
        setPurchased(purchaseRes.data);
      } catch (err) {
        console.log('purchsed fetch err : ', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <section>
        <SectionTitle title='구매한 도록' />
        <SectionCatalog items={purchased} />
      </section>
    </div>
  );
}
