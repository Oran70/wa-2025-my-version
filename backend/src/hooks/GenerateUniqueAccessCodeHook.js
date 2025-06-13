async function generateUniqueAccessCode(StudentModel) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
        let code = '';
        for (let i = 0; i < 10; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        const existing = await StudentModel.findOne({
            where: { parent_access_code: code }
        });
        if (!existing) {
            return code;
        }
        attempts++;
    }

    throw new Error('Unable to generate unique access code');
}
export default generateUniqueAccessCode;
