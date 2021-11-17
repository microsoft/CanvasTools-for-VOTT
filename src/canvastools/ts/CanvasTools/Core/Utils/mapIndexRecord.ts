export function mapIndexRecord<K, T>(record: Record<string, K> | Record<number, K>, mapFn: (c: K, idx: number) => T) {
    const next: Record<number, T> = {};
    Object.entries(record).forEach(([idx, c]) => {
        const iIdx = Number(idx);
        if (Number.isSafeInteger(iIdx)) {
            next[iIdx] = mapFn(c, iIdx);
        }
    });
    return next;
}
