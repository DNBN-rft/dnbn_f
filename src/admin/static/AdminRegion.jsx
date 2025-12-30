import { useState, useEffect } from "react";
import "./css/adminregion.css"
import { getRegionStatistics, getCustStatistics } from "../../utils/adminRegionService";
import { apiGet } from "../../utils/apiClient";

const AdminRegion = () => {
    const [selectedState, setSelectedState] = useState("");
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedSubRegion, setSelectedSubRegion] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedDistrictName, setSelectedDistrictName] = useState("");
    const [selectedTab, setSelectedTab] = useState("franchise"); // franchise or general
    const [franchiseData, setFranchiseData] = useState(null);
    const [generalData, setGeneralData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [stateOptions, setStateOptions] = useState([]);
    const [regionOptions, setRegionOptions] = useState([]);
    const [subRegionOptions, setSubRegionOptions] = useState([]);
    const [districtOptions, setDistrictOptions] = useState([]);

    useEffect(() => {
        const loadStates = async () => {
            try {
                const response = await apiGet('/addr');
                if (response.ok) {
                    const data = await response.json();
                    setStateOptions(data.map(item => ({ label: item.addrName, value: item.cd })));
                } else {
                    console.error('Failed to load states, status:', response.status);
                }
            } catch (error) {
                console.error('Failed to load states', error);
            }
        };
        loadStates();
    }, []);


    const loadRegions = async (cd) => {
        try {
            const response = await apiGet(`/addr?cd=${cd}`);
            if (response.ok) {
                const data = await response.json();
                setRegionOptions(data.map(item => ({ label: item.addrName, value: item.cd })));
            } else {
                console.error('Failed to load regions');
            }
        } catch (error) {
            console.error('Failed to load regions', error);
        }
    };

    const loadSubRegionsOrDistricts = async (cd) => {
        try {
            const response = await apiGet(`/addr?cd=${cd}`);
            if (response.ok) {
                const data = await response.json();
                const options = data.map(item => ({ label: item.addrName, value: item.cd }));
                const hasSubRegions = options.some(opt => opt.label.endsWith('구'));
                if (hasSubRegions) {
                    setSubRegionOptions(options);
                } else {
                    setDistrictOptions(options);
                }
            } else {
                console.error('Failed to load subregions or districts');
            }
        } catch (error) {
            console.error('Failed to load subregions or districts', error);
        }
    };

    const loadDistricts = async (cd) => {
        try {
            const response = await apiGet(`/addr?cd=${cd}`);
            if (response.ok) {
                const data = await response.json();
                setDistrictOptions(data.map(item => ({ label: item.addrName, value: item.cd })));
            } else {
                console.error('Failed to load districts');
            }
        } catch (error) {
            console.error('Failed to load districts', error);
        }
    };

    const handleStateChange = (e) => {
        const cd = e.target.value;
        setSelectedState(cd);
        setSelectedRegion("");
        setSelectedSubRegion("");
        setSelectedDistrict("");
        setSelectedDistrictName("");
        setRegionOptions([]);
        setSubRegionOptions([]);
        setDistrictOptions([]);
        if (cd) {
            loadRegions(cd);
        }
    };

    const handleRegionChange = (e) => {
        const cd = e.target.value;
        setSelectedRegion(cd);
        setSelectedSubRegion("");
        setSelectedDistrict("");
        setSelectedDistrictName("");
        setSubRegionOptions([]);
        setDistrictOptions([]);
        if (cd) {
            loadSubRegionsOrDistricts(cd);
        }
    };

    const handleSubRegionChange = (e) => {
        const cd = e.target.value;
        setSelectedSubRegion(cd);
        setSelectedDistrict("");
        setSelectedDistrictName("");
        setDistrictOptions([]);
        if (cd) {
            loadDistricts(cd);
        }
    };

    const handleDistrictChange = (e) => {
        const cd = e.target.value;
        setSelectedDistrict(cd);
        const selectedOption = districtOptions.find(opt => opt.value === cd);
        setSelectedDistrictName(selectedOption ? selectedOption.label : "");
    };

    const hasSubRegion = subRegionOptions.length > 0;

    const handleSearch = async () => {
        if (!selectedDistrictName) {
            setError("읍면동을 선택해주세요.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const [franchiseResult, generalResult] = await Promise.all([
                getRegionStatistics(selectedDistrictName),
                getCustStatistics(selectedDistrictName)
            ]);

            if (franchiseResult.success && generalResult.success) {
                const franchiseData = franchiseResult.data;
                const generalData = generalResult.data;

                // 가맹점 데이터 변환
                const franchiseLabels = franchiseData.map(item => `${item.month}월`);
                const franchiseSellingPrices = franchiseData.map(item => item.totalSellingPrice); // 원 단위
                const franchiseSellingCounts = franchiseData.map(item => item.totalSellingCnt);

                setFranchiseData({
                    labels: franchiseLabels,
                    sellingPrices: franchiseSellingPrices,
                    sellingCounts: franchiseSellingCounts
                });

                // 고객 데이터 변환
                const generalLabels = generalData.map(item => `${item.month}월`);
                const generalSellingPrices = generalData.map(item => item.totalSellingPrice); // 원 단위
                const generalSellingCounts = generalData.map(item => item.totalSellingCnt);

                setGeneralData({
                    labels: generalLabels,
                    sellingPrices: generalSellingPrices,
                    sellingCounts: generalSellingCounts
                });
            } else {
                setError(franchiseResult.error || generalResult.error);
                setFranchiseData(null);
                setGeneralData(null);
            }
        } catch (err) {
            console.error("API 요청 실패:", err);
            setError("데이터 조회에 실패했습니다. 다시 시도해주세요.");
            setFranchiseData(null);
            setGeneralData(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="adminregion-container">
            <div className="adminregion-wrap">
                <div className="adminregion-filter-wrap">
                    <div className="adminregion-select-wrap">
                        <select name="state" id="state" value={selectedState} onChange={handleStateChange} className="adminregion-select-state">
                            <option value="">전체</option>
                            {stateOptions.map((state) => (
                                <option key={state.value} value={state.value}>{state.label}</option>
                            ))}
                        </select>

                        <select name="region" id="region" value={selectedRegion} onChange={handleRegionChange} className="adminregion-select-region">
                            <option value="">전체</option>
                            {regionOptions.map((region) => (
                                <option key={region.value} value={region.value}>{region.label}</option>
                            ))}
                        </select>

                        {hasSubRegion && (
                            <select name="subregion" id="subregion" value={selectedSubRegion} onChange={handleSubRegionChange} className="adminregion-select-subregion" disabled={!selectedRegion}>
                                <option value="">전체</option>
                                {subRegionOptions.map((subRegion) => (
                                    <option key={subRegion.value} value={subRegion.value}>{subRegion.label}</option>
                                ))}
                            </select>
                        )}

                        <select name="district" id="district" value={selectedDistrict} onChange={handleDistrictChange} className="adminregion-select-district" disabled={!selectedRegion || (hasSubRegion && !selectedSubRegion)}>
                            <option value="">전체</option>
                            {districtOptions.map((district) => (
                                <option key={district.value} value={district.value}>{district.label}</option>
                            ))}
                        </select>

                        <button className="adminregion-search-button" onClick={handleSearch} disabled={loading || !selectedDistrictName}>
                            {loading ? "조회 중..." : "검색"}
                        </button>
                    </div>
                </div>

                <div className="adminregion-static-wrap">
                    <div className="adminregion-static-graph">
                        {error && (
                            <div className="adminregion-error-message" style={{ color: 'red', padding: '10px', marginBottom: '10px' }}>
                                {error}
                            </div>
                        )}
                        {selectedDistrict !== "all" && (franchiseData || generalData) && (
                            <>
                                <div className="adminregion-user-type-tabs">
                                    <button
                                        className={`adminregion-user-tab ${selectedTab === 'franchise' ? 'active' : ''}`}
                                        onClick={() => setSelectedTab('franchise')}
                                    >
                                        가맹점
                                    </button>
                                    <button
                                        className={`adminregion-user-tab ${selectedTab === 'general' ? 'active' : ''}`}
                                        onClick={() => setSelectedTab('general')}
                                    >
                                        일반사용자
                                    </button>
                                </div>

                                <div className="adminregion-chart-area">
                                    {(selectedTab === 'franchise' ? franchiseData : generalData) ? (
                                        <div className="adminregion-chart">
                                            <h3>{selectedDistrictName} - {selectedTab === 'franchise' ? '가맹점 월별 통계' : '일반사용자 월별 통계'}</h3>
                                            <div className="chart-placeholder">
                                                <p>월별 판매액 및 판매건수</p>
                                                <div className="chart-bars">
                                                    {(selectedTab === 'franchise' ? franchiseData : generalData).labels.map((label, index) => {
                                                        const data = selectedTab === 'franchise' ? franchiseData : generalData;
                                                        const priceValue = data.sellingPrices[index];
                                                        const countValue = data.sellingCounts[index];
                                                        const maxPrice = Math.max(...data.sellingPrices);
                                                        const maxCount = Math.max(...data.sellingCounts);
                                                        const priceHeight = (priceValue / maxPrice) * 100;
                                                        const countHeight = (countValue / maxCount) * 100;
                                                        return (
                                                            <div key={index} className="chart-bar-group">
                                                                <div className="chart-bar-container">
                                                                    <div 
                                                                        className="chart-bar price-bar"
                                                                        style={{ height: `${priceHeight}%`, minHeight: '5px' }}
                                                                    >
                                                                        <span className="chart-value">{priceValue.toLocaleString()}</span>
                                                                    </div>
                                                                    <div 
                                                                        className="chart-bar count-bar"
                                                                        style={{ height: `${countHeight}%`, minHeight: '5px' }}
                                                                    >
                                                                        <span className="chart-value">{countValue}</span>
                                                                    </div>
                                                                </div>
                                                                <span className="chart-label">{label}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <div className="chart-legend">
                                                    <div className="legend-item">
                                                        <div className="legend-color price-bar"></div>
                                                        <span>판매액</span>
                                                    </div>
                                                    <div className="legend-item">
                                                        <div className="legend-color count-bar"></div>
                                                        <span>판매건수</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="adminregion-no-data">
                                            <p>데이터를 불러오는 중입니다...</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                        {(selectedDistrict === "all" || (!franchiseData && !generalData)) && (
                            <div className="adminregion-no-data">
                                <p>읍면동을 선택하고 검색 버튼을 클릭해주세요</p>
                            </div>
                        )}
                    </div>
                    <div className="adminregion-static-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>월</th>
                                    <th>판매액</th>
                                    <th>판매건수</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(selectedTab === 'franchise' ? franchiseData : generalData) ? (
                                    (selectedTab === 'franchise' ? franchiseData : generalData).labels.map((label, index) => {
                                        const data = selectedTab === 'franchise' ? franchiseData : generalData;
                                        return (
                                            <tr key={index}>
                                                <td>{label}</td>
                                                <td>{data.sellingPrices[index].toLocaleString()}</td>
                                                <td>{data.sellingCounts[index]}</td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="3">데이터가 없습니다</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminRegion;