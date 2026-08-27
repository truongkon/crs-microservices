import { useState } from 'react';

interface SearchBoxProps {
    onSearch: (keyword: string) => void;
}

export default function SearchBox({ onSearch }: SearchBoxProps) {
    const [text, setText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Ngăn reload trang
        onSearch(text);
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
            <input
                type="text"
                placeholder="Tim kiem theo ten mon hoc..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{ padding: '6px 12px', width: 300 }}
            />
            <button type="submit" style={{ marginLeft: 8 }}>
                Tim kiếm
            </button>
        </form>
    );
}