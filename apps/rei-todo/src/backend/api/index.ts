export async function mockApi() {
    return Promise.resolve({
        data: {
            list: Array.from({ length: 100 }).map((_, index) => ({
                id: index,
                title: `Todo ${index}`,
                completed: Math.random() > 0.5,
            })),
        },
    });
}