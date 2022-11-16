import React, { useState } from 'react';

const MinHeightDefault = 155;

const HomeIntro: React.FC = () => {
    const [height, setHeight] = useState<number>(MinHeightDefault);

    const handleClick = () => {
        if (height === MinHeightDefault) {
            setHeight(350);
        } else {
            setHeight(MinHeightDefault);
        }
    };

    return (
        <div>
            <div className="overflow-hidden relative" style={{ height: height }}>
                <div className="font-bold text-lg mb-2">
                    Chợ đồ si - Chợ Mua Bán, Rao Vặt Trực Tuyến Hàng Đầu Của Người Việt
                </div>
                <div>
                    <p className="mb-[5px] text-xs text-[#777]">
                        Chợ đồ si chính thức gia nhập thị trường Việt Nam vào đầu năm 2012, với mục đích tạo ra cho bạn
                        một kênh rao vặt trung gian, kết nối người mua với người bán lại với nhau bằng những giao dịch
                        cực kỳ đơn giản, tiện lợi, nhanh chóng, an toàn, mang đến hiệu quả bất ngờ.
                    </p>
                    <p className="mb-[5px] text-xs text-[#777]">
                        Đến nay, Chợ đồ si tự hào là Website rao vặt được ưa chuộng hàng đầu Việt Nam. Hàng ngàn món hời
                        từ Bất động sản, Nhà cửa, Xe cộ, Đồ điện tử, Thú cưng, Vật dụng cá nhân... đến tìm việc làm,
                        thông tin tuyển dụng, các dịch vụ - du lịch được đăng tin, rao bán trên Chợ đồ si.
                    </p>
                    <p className="mb-[5px] text-xs text-[#777]">
                        Với Chợ đồ si, bạn có thể dễ dàng mua bán, trao đổi bất cứ một loại mặt hàng nào, dù đó là đồ cũ
                        hay đồ mới với nhiều lĩnh vực:
                    </p>
                    <p className="mb-[5px] text-xs text-[#777]">
                        <b>Bất động sản:</b> Cho thuê, Mua bán nhà đất, căn hộ chung cư, văn phòng mặt bằng kinh doanh,
                        phòng trọ đa dạng về diện tích, vị trí
                    </p>
                    <p className="mb-[5px] text-xs text-[#777]">
                        <b>Phương tiện đi lại:</b> xe ô tô, xe máy có độ bền cao, giá cả hợp lý, giấy tờ đầy đủ.
                    </p>
                    <p className="mb-[5px] text-xs text-[#777]">
                        <b>Đồ dùng cá nhân:</b> quần áo, giày dép, túi xách, đồng hồ... đa phong cách, hợp thời trang.
                    </p>
                    <p className="mb-[5px] text-xs text-[#777]">
                        <b>Đồ điện tử:</b> điện thoại di động, máy tính bảng, laptop, tivi, loa, amply...; đồ điện gia
                        dụng: máy giặt, tủ lạnh, máy lạnh điều hòa... với rất nhiều nhãn hiệu, kích thước khác nhau.
                    </p>
                    <p className="mb-[5px] text-xs text-[#777]">
                        <b>Bất động sản:</b> Cho thuê, Mua bán nhà đất, căn hộ chung cư, văn phòng mặt bằng kinh doanh,
                        phòng trọ đa dạng về diện tích, vị trí
                    </p>
                    <p className="mb-[5px] text-xs text-[#777]">
                        Và còn rất nhiều mặt hàng khác nữa đã và đang được rao bán tại Chợ đồ si.
                    </p>
                    <p className="mb-[5px] text-xs text-[#777]">
                        Mỗi người trong chúng ta đều có những sản phẩm đã qua sử dụng và không cần dùng tới nữa. Vậy còn
                        chần chừ gì nữa mà không để nó trở nên giá trị hơn với người khác. Rất đơn giản, bạn chỉ cần
                        chụp hình lại, mô tả cụ thể về sản phẩm và sử dụng ứng dụng Đăng tin miễn phí của Chợ đồ si là đã
                        có thể đến gần hơn với người cần nó.
                    </p>
                    <p className="mb-[5px] text-xs text-[#777]">
                        Không những thế, website chodosi còn cung cấp cho bạn thông tin về giá cả các mặt hàng để bạn có
                        thể tham khảo. Đồng thời, thông qua Blog kinh nghiệm, Chợ đồ si sẽ tư vấn, chia sẻ cho bạn những
                        thông tin bổ ích, bí quyết, mẹo vặt giúp bạn có những giao dịch mua bán an toàn, đảm bảo. Chợ
                        Tốt cũng sẵn sàng hỗ trợ bạn trong mọi trường hợp cần thiết.
                    </p>
                    <p className="mb-[5px] text-xs text-[#777]">
                        Chúc các bạn có những trải nghiệm mua bán tuyệt vời trên Chợ đồ si.
                    </p>
                </div>
                {height === MinHeightDefault && (
                    <div
                        className="h-[25px] w-full absolute bottom-0"
                        style={{ background: 'linear-gradient(to top, rgb(243, 243, 243), rgba(255, 255, 255, 0.15))' }}
                    />
                )}
            </div>
            <div className="text-xs w-full text-center text-[#38699f] cursor-pointer" onClick={handleClick}>
                {height === MinHeightDefault ? 'Mở rộng' : 'Thu gọn'}
            </div>
        </div>
    );
};

export default HomeIntro;
