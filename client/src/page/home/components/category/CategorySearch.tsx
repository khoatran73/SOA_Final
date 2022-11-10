import { Pagination } from 'antd';
import clsx from 'clsx';
import React from 'react';
import BoxContainer from '../../layout/BoxContainer';
import NewsResultSearchInfo from '../news/NewsResultSearchInfo';
import HomeBreadCrumb from './../../layout/HomeBreadCrumb';

type CardProps = {
    children: React.ReactNode;
    className?: string;
};

const Card = (props: CardProps) => {
    return <div className={clsx('my-2 rounded-sm bg-blue-100 p-3', props.className)}>{props.children}</div>;
};

const CategorySearch: React.FC = () => {
    return (
        <BoxContainer className="p-0 bg-transparent">
            <div className="flex">
                <div className="flex flex-col w-[65%]">
                    <HomeBreadCrumb item={[{ title: 'trang chu', link: '/' }, { title: 'tim kiem' }]} />
                    <Card>
                        <div>filter</div>
                    </Card>
                    <Card>
                        <div>thong tin</div>
                    </Card>
                    <Card className="p-0">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                            <div className="flex flex-col" key={num}>
                                <NewsResultSearchInfo />
                            </div>
                        ))}
                    </Card>
                    <Card>
                        <Pagination defaultCurrent={1} total={50} />
                    </Card>
                </div>
                <div className="w-[35%] bg-gray-main" />
            </div>
        </BoxContainer>
    );
};

export default CategorySearch;
