import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import HTMLFlipBook from 'react-pageflip';
import { instance } from '../../apis/instance';
import styles from './LeafletViewer.module.css';

const BOOK_RATIO = 1.414; // A4 비율

export default function LeafletViewer() {
    const { category, id } = useParams(); // category: 'galleries' 또는 'exhibitions'
    const [leafletData, setLeafletData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 767);
    const flipBookRef = useRef(null);

    // 화면 크기 감지
    useEffect(() => {
        const checkScreenSize = () => setIsDesktop(window.innerWidth > 767);
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // 데이터 조회
    useEffect(() => {
        const fetchLeaflet = async () => {
            try {
                setIsLoading(true);
                const apiCategory = category === 'galleries' ? 'galleryCategory' : 'exhibitionCategory';

                const res = await instance.get(`/api/leaflet`, {
                    params: {
                        category: apiCategory,
                        category_id: id,
                    },
                });

                let data = null;
                if (Array.isArray(res.data)) {
                    if (res.data.length > 0) data = res.data[0];
                } else {
                    data = res.data;
                }

                if (data) {
                    setLeafletData(data);
                } else {
                    setError('리플렛을 찾을 수 없습니다.');
                }
            } catch (err) {
                console.error(err);
                setError('리플렛을 불러오는데 실패했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeaflet();
    }, [category, id]);

    // 키보드 네비게이션
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (!leafletData || !flipBookRef.current) return;
            if (e.key === 'ArrowLeft') flipBookRef.current.pageFlip().flipPrev();
            if (e.key === 'ArrowRight') flipBookRef.current.pageFlip().flipNext();
        };
        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [leafletData]);

    if (isLoading) return <div className={styles.container}><div className={styles.loading}>로딩 중...</div></div>;
    if (error) return <div className={styles.container}><div className={styles.error}>{error}</div></div>;
    if (!leafletData) return null;

    const { image_urls } = leafletData;
    const totalPages = image_urls ? image_urls.length : 0;
    const coverUrl = image_urls && image_urls.length > 0 ? image_urls[0] : '';

    // 페이지 설정
    const pageWidth = isDesktop ? 500 : 300;
    const pageHeight = Math.round(pageWidth * BOOK_RATIO);

    return (
        <div className={styles.container}>
            {coverUrl && (
                <div
                    className={styles.ambientBackground}
                    style={{ backgroundImage: `url(${coverUrl})` }}
                />
            )}
            <div className={styles.overlay} />

            <div className={styles.flipBookWrapper}>
                <HTMLFlipBook
                    ref={flipBookRef}
                    width={pageWidth}
                    height={pageHeight}
                    size="fixed"
                    minWidth={280}
                    maxWidth={isDesktop ? 600 : 350}
                    minHeight={Math.round(280 * BOOK_RATIO)}
                    maxHeight={Math.round((isDesktop ? 600 : 350) * BOOK_RATIO)}
                    showCover={true}
                    mobileScrollSupport={true}
                    className={styles.flipBook}
                    onFlip={(e) => setCurrentPage(e.data)}
                    usePortrait={!isDesktop}
                    startPage={0}
                    drawShadow={true}
                    flippingTime={800}
                    usePageShadow={true}
                    startZIndex={1}
                >
                    {image_urls && image_urls.map((url, index) => (
                        <div key={index} className={styles.pageBox}>
                            <img src={url} alt={`Page ${index + 1}`} className={styles.pageImage} />
                        </div>
                    ))}
                </HTMLFlipBook>
            </div>
            <div className={styles.pageNumber}>
                {currentPage + 1} / {totalPages}
            </div>
        </div>
    );
}
