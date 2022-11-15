import { faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import React from 'react';
import { Link } from 'react-router-dom';
import { BaseIcon } from '~/component/Icon/BaseIcon';

interface Props {
    item: BreadcrumbItem[];
    className?: string;
}

type BreadcrumbItem = {
    title: string;
    link?: string;
};

const HomeBreadCrumb: React.FC<Props> = props => {
    return (
        <div className={clsx('my-2 rounded-sm p-3 flex items-center', props.className)}>
            {props.item.map((x, index) => {
                return (
                    <div key={x.title} className="flex items-center">
                        {index > 0 && index < props.item.length && (
                            <div className="mx-2">
                                <BaseIcon icon={faAnglesRight} size="xs" className="relative top-[1px]" />
                            </div>
                        )}
                        {x.link ? <Link to={x.link}>{x.title}</Link> : <div>{x.title}</div>}
                    </div>
                );
            })}
        </div>
    );
};

export default HomeBreadCrumb;
