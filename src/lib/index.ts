export const getFileFromUrl = async (name: string, url: string) => {
	try {
		const response = await fetch("/images" + url);
		const data = await response.blob();
		return new File([data], name, {
			type: data.type,
		});
	} catch (e) {
		console.log(e);
	}
};
export const readURL = (file: File) => {
	return new Promise<string>((res, rej) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			const t = e.target;
			if (t == null || t.result == null) rej(e);
			else res(t.result.toString() || "");
		};
		reader.onerror = (e) => rej(e);
		reader.readAsDataURL(file);
	});
};
export const formToObj = (e: any) => {
    const data = Object.fromEntries(new FormData(e.target).entries());
	return data
}
export const clearForm = (e: any) => {
    Array.from(e.target.elements).forEach((input: any) => {
        if (input.tagName == 'INPUT') input.value = ""
    });
}
