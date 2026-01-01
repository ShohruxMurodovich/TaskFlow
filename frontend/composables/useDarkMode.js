export const useDarkMode = () => {
    const isDark = useState('darkMode', () => {
        // Initialize from localStorage on first load
        if (process.client) {
            const saved = localStorage.getItem('darkMode');
            return saved === 'true';
        }
        return false;
    });

    // Apply theme to document
    const applyTheme = (dark) => {
        if (process.client) {
            if (dark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    };

    // Apply theme on mount
    onMounted(() => {
        applyTheme(isDark.value);
    });

    const toggle = () => {
        isDark.value = !isDark.value;
        if (process.client) {
            localStorage.setItem('darkMode', isDark.value.toString());
            applyTheme(isDark.value);
        }
    };

    return {
        isDark: readonly(isDark),
        toggle
    };
};
