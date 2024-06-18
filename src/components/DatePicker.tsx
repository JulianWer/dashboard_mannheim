interface IDatePicker {
    selectedDate: string;
    setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
}

export function DatePicker({selectedDate, setSelectedDate}: IDatePicker) {
    return (
        <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
        />
    );
}
