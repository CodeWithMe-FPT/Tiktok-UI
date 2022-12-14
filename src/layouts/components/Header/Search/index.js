import classNames from 'classnames/bind';
import styles from './Search.module.scss';
import HeadlessTippy from '@tippyjs/react/headless';
import { Fragment, useEffect, useRef, useState } from 'react';

import * as APIService from '~/services/APIService';
import { WrapperSearch as PopperWrapper } from '~/components/Popper';
import { AccountItem } from '~/components/AccountItem';
import { LoadingIcon, RemoveIcon, SearchIcon } from '~/components/Icon';
import { useLocation } from 'react-router-dom';

const cx = classNames.bind(styles);

function Search() {
    const [searchValue, setSearchValue] = useState('');
    const [visible, setVisible] = useState(false);
    const [loadAnimation, setLoadAnimation] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const [requestSearch, setRequestSearch] = useState(false);
    let location = useLocation();
    const myTimeout = useRef();
    const onClickOutside = useRef(false);
    const onSelect = useRef(-1);
    const inputRef = useRef(null);

    const getSelectedText = () => {
        var text = '';
        if (typeof window.getSelection != 'undefined') {
            text = window.getSelection().toString();
        } else if (typeof document.selection !== 'undefined' && document.selection.type === 'Text') {
            text = document.selection.createRange().text;
        }
        return text;
    };

    const doSomethingWithSelectedText = () => {
        var selectedText = getSelectedText();
        if (selectedText) {
            onSelect.current = 0;
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleclick);
        document.addEventListener('mouseup', doSomethingWithSelectedText);
        document.addEventListener('mousedown', doSomethingWithSelectedText);
        return () => {
            document.removeEventListener('mouseup', doSomethingWithSelectedText);
            document.removeEventListener('mousedown', doSomethingWithSelectedText);
            document.removeEventListener('click', handleclick);
        };
    });

    useEffect(() => {
        if (location.pathname.charAt(1) !== '@') {
            setSearchValue('');
            setSearchResult([]);
        }
        setVisible(false);
        onClickOutside.current = false;
    }, [location]);

    useEffect(() => {
        clearTimeout(myTimeout.current);
        if (requestSearch) {
            setLoadAnimation(false);
            myTimeout.current = setTimeout(async () => {
                setLoadAnimation(true);
                setVisible(false);
                setSearchResult('');
                let res = await APIService.search(searchValue.trim(), 'less');
                setTimeout(() => {
                    if (!onClickOutside.current) {
                        setVisible(true);
                    } else {
                        setVisible(false);
                    }
                    setSearchResult(res);
                    setLoadAnimation(false);
                    setRequestSearch(false);
                }, 500);
            }, 700);
        }
    }, [searchValue, requestSearch]);

    const handleclick = (e) => {
        if (!inputRef.current.contains(e.target)) {
            if (onSelect.current === 0) {
                onSelect.current = 1;
            } else {
                onClickOutside.current = true;
            }
        }
    };

    const handleChange = (e) => {
        if (e.target.value !== ' ') {
            setSearchValue(e.target.value);
            if (e.target.value === '') {
                setRequestSearch(false);
                setVisible(false);
            } else {
                if (searchResult) {
                    setVisible(true);
                }
                setRequestSearch(true);
            }
        } else {
            e.target.value = '';
        }
    };

    const handleFocus = (e) => {
        onClickOutside.current = false;
        if (e.target.value !== '') {
            setVisible(true);
        }
    };

    const handleOnClickInput = (e) => {
        if (getSelectedText && onSelect.current === 1) {
            window.getSelection().removeAllRanges();
            onSelect.current = -1;
        }
    };

    const handleOnClickRemove = () => {
        setSearchValue('');
        setRequestSearch(false);
    };

    return (
        <div className={cx('search-bar__container')}>
            <form className={cx('search-bar__form')}>
                <HeadlessTippy
                    interactive
                    render={(attrs) => (
                        <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                            <PopperWrapper>
                                {/* <div className={cx('accounts-title')}>{searchResult}</div> */}
                                <div className={cx('accounts-title')}>Accounts</div>
                                {searchResult &&
                                    searchResult.map((item) => {
                                        if (item.avatar === 'https://files.fullstack.edu.vn/f8-tiktok/') {
                                            item.avatar = '';
                                        }
                                        return (
                                            <AccountItem
                                                key={item.id}
                                                data={item}
                                                onClick={() => {
                                                    setSearchValue(item.nickname);
                                                    setRequestSearch(true);
                                                }}
                                            />
                                        );
                                    })}
                            </PopperWrapper>
                        </div>
                    )}
                    visible={visible && searchResult.length > 0 && !onClickOutside.current && Boolean(searchValue)}
                    onClickOutside={(e) => {
                        setVisible(false);
                    }}
                >
                    <input
                        ref={inputRef}
                        className={
                            searchValue.length !== 0 ? cx('search-bar__input') : cx('search-bar__input--no-icon')
                        }
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onClick={handleOnClickInput}
                        value={searchValue}
                        typeof="search"
                        placeholder="Search accounts and videos"
                    />
                </HeadlessTippy>

                {loadAnimation ? (
                    <LoadingIcon className={cx('loading-icon')} />
                ) : searchValue.length !== 0 ? (
                    <RemoveIcon onClick={handleOnClickRemove} />
                ) : (
                    <Fragment />
                )}

                <span className={cx('search-bar__spacing')}></span>
                <button className={cx('search-bar__icon')} typeof="submit">
                    <SearchIcon fill={searchValue ? 'rgba(22, 24, 35, 0.75);' : 'rgba(22, 24, 35, 0.34)'} />
                </button>
            </form>
        </div>
    );
}
export default Search;
