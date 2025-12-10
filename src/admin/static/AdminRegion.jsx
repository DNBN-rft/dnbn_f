import { useState } from "react";
import "./css/adminregion.css"

const AdminRegion = () => {
    const [selectedState, setSelectedState] = useState("seoul");
    const [selectedRegion, setSelectedRegion] = useState("all");
    const [selectedDistrict, setSelectedDistrict] = useState("all");
    const [selectedTab, setSelectedTab] = useState("franchise"); // franchise or general
    const [chartData, setChartData] = useState(null);

    // 시/도 데이터
    const stateData = [
        { value: "seoul", label: "서울특별시" },
        { value: "busan", label: "부산광역시" },
        { value: "daegu", label: "대구광역시" },
        { value: "incheon", label: "인천광역시" },
        { value: "gwangju", label: "광주광역시" },
        { value: "daejeon", label: "대전광역시" },
        { value: "ulsan", label: "울산광역시" },
        { value: "sejong", label: "세종특별자치시" },
        { value: "gyeonggi", label: "경기도" },
        { value: "gangwon", label: "강원도" },
        { value: "chungbuk", label: "충청북도" },
        { value: "chungnam", label: "충청남도" },
        { value: "jeonbuk", label: "전라북도" },
        { value: "jeonnam", label: "전라남도" },
        { value: "gyeongbuk", label: "경상북도" },
        { value: "gyeongnam", label: "경상남도" },
        { value: "jeju", label: "제주특별자치도" }
    ];

    // 시/도별 구/군 데이터
    const regionData = {
        seoul: ["강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"],
        busan: ["강서구", "금정구", "기장군", "남구", "동구", "동래구", "부산진구", "북구", "사상구", "사하구", "서구", "수영구", "연제구", "영도구", "중구", "해운대구"],
        daegu: ["남구", "달서구", "달성군", "동구", "북구", "서구", "수성구", "중구"],
        incheon: ["강화군", "계양구", "남동구", "동구", "미추홀구", "부평구", "서구", "연수구", "옹진군", "중구"],
        gwangju: ["광산구", "남구", "동구", "북구", "서구"],
        daejeon: ["대덕구", "동구", "서구", "유성구", "중구"],
        ulsan: ["남구", "동구", "북구", "울주군", "중구"],
        sejong: ["세종시"],
        gyeonggi: ["가평군", "고양시", "과천시", "광명시", "광주시", "구리시", "군포시", "김포시", "남양주시", "동두천시", "부천시", "성남시", "수원시", "시흥시", "안산시", "안성시", "안양시", "양주시", "양평군", "여주시", "연천군", "오산시", "용인시", "의왕시", "의정부시", "이천시", "파주시", "평택시", "포천시", "하남시", "화성시"],
        gangwon: ["강릉시", "고성군", "동해시", "삼척시", "속초시", "양구군", "양양군", "영월군", "원주시", "인제군", "정선군", "철원군", "춘천시", "태백시", "평창군", "홍천군", "화천군", "횡성군"],
        chungbuk: ["괴산군", "단양군", "보은군", "영동군", "옥천군", "음성군", "제천시", "증평군", "진천군", "청주시", "충주시"],
        chungnam: ["계룡시", "공주시", "금산군", "논산시", "당진시", "보령시", "부여군", "서산시", "서천군", "아산시", "예산군", "천안시", "청양군", "태안군", "홍성군"],
        jeonbuk: ["고창군", "군산시", "김제시", "남원시", "무주군", "부안군", "순창군", "완주군", "익산시", "임실군", "장수군", "전주시", "정읍시", "진안군"],
        jeonnam: ["강진군", "고흥군", "곡성군", "광양시", "구례군", "나주시", "담양군", "목포시", "무안군", "보성군", "순천시", "신안군", "여수시", "영광군", "영암군", "완도군", "장성군", "장흥군", "진도군", "함평군", "해남군", "화순군"],
        gyeongbuk: ["경산시", "경주시", "고령군", "구미시", "군위군", "김천시", "문경시", "봉화군", "상주시", "성주군", "안동시", "영덕군", "영양군", "영주시", "영천시", "예천군", "울릉군", "울진군", "의성군", "청도군", "청송군", "칠곡군", "포항시"],
        gyeongnam: ["거제시", "거창군", "고성군", "김해시", "남해군", "밀양시", "사천시", "산청군", "양산시", "의령군", "진주시", "창녕군", "창원시", "통영시", "하동군", "함안군", "함양군", "합천군"],
        jeju: ["서귀포시", "제주시"]
    };

    // 구/군별 동/읍/면 데이터 (예시: 서울 일부 구와 경기 일부 시)
    const districtData = {
        "강남구": ["개포동", "논현동", "대치동", "도곡동", "삼성동", "세곡동", "수서동", "신사동", "압구정동", "역삼동", "율현동", "일원동", "청담동"],
        "강동구": ["강일동", "고덕동", "길동", "둔촌동", "명일동", "상일동", "성내동", "암사동", "천호동"],
        "강북구": ["미아동", "번동", "수유동", "우이동"],
        "강서구": ["가양동", "개화동", "공항동", "과해동", "내발산동", "등촌동", "마곡동", "방화동", "염창동", "오곡동", "오쇠동", "외발산동", "화곡동"],
        "관악구": ["남현동", "봉천동", "신림동"],
        "광진구": ["광장동", "구의동", "군자동", "능동", "자양동", "중곡동", "화양동"],
        "구로구": ["가리봉동", "개봉동", "고척동", "구로동", "궁동", "오류동", "온수동", "천왕동", "항동"],
        "금천구": ["가산동", "독산동", "시흥동"],
        "노원구": ["공릉동", "상계동", "월계동", "중계동", "하계동"],
        "도봉구": ["도봉동", "방학동", "쌍문동", "창동"],
        "수원시": ["권선구", "영통구", "장안구", "팔달구"],
        "성남시": ["분당구", "수정구", "중원구"],
        "용인시": ["기흥구", "수지구", "처인구"],
        "고양시": ["덕양구", "일산동구", "일산서구"],
        "부천시": ["오정구", "소사구", "원미구"],
        "안산시": ["단원구", "상록구"],
        "안양시": ["동안구", "만안구"],
        "남양주시": ["와부읍", "진접읍", "화도읍", "별내동", "퇴계원읍", "다산동", "진건읍", "오남읍", "수동면", "조안면"],
        "김포시": ["김포동", "장기동", "고촌읍", "양촌읍", "대곶면", "월곶면", "하성면", "통진읍"],
        "제주시": ["건입동", "노형동", "도두동", "삼도동", "삼양동", "애월읍", "아라동", "연동", "오라동", "용담동", "이도동", "일도동", "조천읍", "한경면", "한림읍", "추자면", "구좌읍", "우도면"],
        "서귀포시": ["강정동", "대정읍", "대천동", "동홍동", "법환동", "보목동", "서귀동", "서홍동", "안덕면", "영천동", "예래동", "월평동", "토평동", "표선면", "하원동", "호근동", "효돈동", "남원읍", "성산읍"]
    };

    const handleStateChange = (e) => {
        const newState = e.target.value;
        setSelectedState(newState);
        setSelectedRegion("all");
    };

    const handleRegionChange = (e) => {
        const newRegion = e.target.value;
        setSelectedRegion(newRegion);
        // 구/군이 변경되면 첫 번째 동/읍/면으로 초기화
        if (newRegion !== "all" && districtData[newRegion]) {
            setSelectedDistrict(districtData[newRegion][0]);
        } else {
            setSelectedDistrict("all");
        }
    };

    const handleSearch = () => {
        // 검색 버튼 클릭 시 그래프 데이터 생성 (예시 데이터)
        const mockData = {
            labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
            franchise: [120, 190, 150, 180, 220, 250],
            general: [80, 100, 90, 110, 140, 160]
        };
        setChartData(mockData);
    };

    // 동/읍/면 목록 가져오기
    const getDistrictList = () => {
        if (selectedRegion === "all") return [];
        return districtData[selectedRegion] || [];
    };

    return (
        <div className="adminregion-container">
            <div className="adminregion-wrap">
                <div className="adminregion-filter-wrap">
                    <div className="adminregion-select-wrap">
                        <select name="state" id="state" value={selectedState} onChange={handleStateChange} className="adminregion-select-state">
                            {stateData.map((state) => (
                                <option key={state.value} value={state.value}>{state.label}</option>
                            ))}
                        </select>

                        <select name="region" id="region" value={selectedRegion} onChange={handleRegionChange} className="adminregion-select-region">
                            <option value="all">전체</option>
                            {regionData[selectedState]?.map((region, index) => (
                                <option key={index} value={region}>{region}</option>
                            ))}
                        </select>

                        <button className="adminregion-search-button" onClick={handleSearch}>검색</button>
                    </div>
                </div>

                <div className="adminregion-static-wrap">
                    <div className="adminregion-static-graph">
                        {selectedRegion !== "all" && getDistrictList().length > 0 && (
                            <>
                                <div className="adminregion-tabs">
                                    {getDistrictList().map((district, index) => (
                                        <button
                                            key={index}
                                            className={`adminregion-tab ${selectedDistrict === district ? 'active' : ''}`}
                                            onClick={() => setSelectedDistrict(district)}
                                        >
                                            {district}
                                        </button>
                                    ))}
                                </div>

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
                                    {chartData ? (
                                        <div className="adminregion-chart">
                                            <h3>{selectedDistrict} - {selectedTab === 'franchise' ? '가맹점 판매 추이' : '사용자 구매 추이'}</h3>
                                            <div className="chart-placeholder">
                                                <p>{selectedTab === 'franchise' ? '월별 판매 데이터' : '월별 구매 데이터'}</p>
                                                <div className="chart-bars">
                                                    {chartData.labels.map((label, index) => {
                                                        const value = selectedTab === 'franchise' 
                                                            ? chartData.franchise[index] 
                                                            : chartData.general[index];
                                                        return (
                                                            <div key={index} className="chart-bar-group">
                                                                <div 
                                                                    className="chart-bar"
                                                                    style={{ height: `${value}px` }}
                                                                >
                                                                    <span className="chart-value">{value}</span>
                                                                </div>
                                                                <span className="chart-label">{label}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="adminregion-no-data">
                                            <p>검색 버튼을 클릭하여 데이터를 조회하세요</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                        {(selectedRegion === "all" || getDistrictList().length === 0) && (
                            <div className="adminregion-no-data">
                                <p>구/군을 선택하면 동/읍/면별 데이터를 확인할 수 있습니다</p>
                            </div>
                        )}
                    </div>
                    <div className="adminregion-static-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>지역</th>
                                    <th>통계 항목 1</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>예시 지역 1</td>
                                    <td>데이터 1</td>
                                </tr>
                                <tr>
                                    <td>예시 지역 2</td>
                                    <td>데이터 2</td>
                                </tr>
                                <tr>
                                    <td>예시 지역 3</td>
                                    <td>데이터 3</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminRegion;