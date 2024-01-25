import { atom, map } from "nanostores";

export const recentDonations = map({});
export const newestTimestamp = atom(null);
export const fundraiserInfo = map({});

export function updateRecentDonations(data) {
    // Move existing donations down and add new ones to the top
    data.slice(0, 3).forEach((donation, index) => {
        recentDonations.setKey(index, donation);
    });
}

export function updateFundraiserInfo(title, desciption) {
    fundraiserInfo.setKey("title", title);
    fundraiserInfo.setKey("desciption", desciption);
}
