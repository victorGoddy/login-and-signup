import { useEffect, useState } from 'react';
import { collection, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from "../firebase";

const useAdvertisement = () => {
    const [advertisement, setAdvertisement] = useState(null);

    useEffect(() => {
        const fetchAdvertisement = async () => {
            try {
                const adsCollection = collection(db, 'ads');
                const query = await getDocs(adsCollection, orderBy('createdAt', 'desc'), limit(1));
                
                if (!query.empty) {
                    query.forEach((doc) => {
                        setAdvertisement(doc.data());
                    });
                }
            } catch (error) {
                console.error('Error fetching advertisement:', error);
            }
        };

        fetchAdvertisement();
    }, []);

    return advertisement;
};

export default useAdvertisement;
