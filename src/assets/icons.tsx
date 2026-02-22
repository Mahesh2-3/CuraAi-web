import {
    AntDesign,
    Entypo,
    EvilIcons,
    Feather,
    FontAwesome,
    FontAwesome6,
    Fontisto,
    Foundation,
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
} from "@expo/vector-icons";
import React from "react";

type IconProps = {
    size?: number;
    color?: string;
};

/* ================= AI / CHAT ================= */

export const AiChatIcon = ({ size = 24, color = "#000" }: IconProps) => (
    <Ionicons name="chatbubbles-outline" size={size} color={color} />
);

export const SendBtnIcon = ({ size = 24, color = "#000", bgColor }: IconProps) => (
    <Ionicons name="send-outline" size={size} color={color} />
);

/* ================= NAVIGATION ================= */

export const BackIcon = ({ size = 24, color = "#000" }: IconProps) => (
    <Ionicons name="arrow-back-outline" size={size} color={color} />
);

export const MenuIcon = ({ size = 28, color = "#000" }: IconProps) => (
    <Ionicons name="menu-outline" size={size} color={color} />
);

export const CloseIcon = ({ size = 28, color = "#000" }: IconProps) => (
    <Ionicons name="close-outline" size={size} color={color} />
);

export const ThreeDotsIcon = ({ size = 22, color = "#000" }: IconProps) => (
    <Ionicons name="ellipsis-vertical" size={size} color={color} />
);

/* ================= FORMS / AUTH ================= */

export const MailIcon = ({ size = 22, color = "#000" }: IconProps) => (
    <Ionicons name="mail-outline" size={size} color={color} />
);

export const LockIcon = ({ size = 22, color = "#000" }: IconProps) => (
    <Ionicons name="lock-closed-outline" size={size} color={color} />
);

export const PhoneIcon = ({ size = 22, color = "#000" }: IconProps) => (
    <Ionicons name="call-outline" size={size} color={color} />
);

export const GoogleIcon = ({ size = 22, color = "#000" }: IconProps) => (
    <Ionicons name="logo-google" size={size} color={color} />
);

export const EyeIcon = ({ size = 22, color = "#000" }: IconProps) => (
    <Ionicons name="eye-outline" size={size} color={color} />
);

export const EyeCrossIcon = ({ size = 22, color = "#000" }: IconProps) => (
    <Ionicons name="eye-off-outline" size={size} color={color} />
);

/* ================= PROFILE / SETTINGS ================= */

export const UserIcon = ({ size = 24, color = "#000" }: IconProps) => (
    <Ionicons name="person-outline" size={size} color={color} />
);

export const EditIcon = ({ size = 22, color = "#000" }: IconProps) => (
    <Ionicons name="create-outline" size={size} color={color} />
);

export const SettingsIcon = ({ size = 24, color = "#000" }: IconProps) => (
    <Ionicons name="settings-outline" size={size} color={color} />
);

export const InfoIcon = ({ size = 22, color = "#000" }: IconProps) => (
    <Ionicons name="information-circle-outline" size={size} color={color} />
);
export const History = ({ size = 22, color = "#000" }: IconProps) => (
    <AntDesign name="history" size={size} color={color} />
);
export const Ai = ({ size = 22, color = "#000" }: IconProps) => (
    <MaterialCommunityIcons name="robot-excited" size={size} color={color} />
);
export const Notifications = ({ size = 22, color = "#000" }: IconProps) => (
    <Ionicons name="notifications" size={size} color={color} />
);
export const UiUx = ({ size = 22, color = "#000" }: IconProps) => (
    <MaterialIcons name="touch-app" size={size} color={color} />
);
export const Support = ({ size = 22, color = "#000" }: IconProps) => (
    <MaterialIcons name="support-agent" size={size} color={color} />
);
export const Logout = ({ size = 22, color = "#000" }: IconProps) => (
    <MaterialIcons name="logout" size={size} color={color} />
);
export const Check = ({ size = 22, color = "#000" }: IconProps) => (
    <Entypo name="check" size={size} color={color} />
);



/* ================= HEALTH / MEDICAL ================= */

export const CoughIcon = ({ size = 26, color = "#000" }: IconProps) => (
    <MaterialCommunityIcons name="lungs" size={size} color={color} />
);
export const ReloadIcon = ({ size = 26, color = "#000" }: IconProps) => (
    <MaterialCommunityIcons name="reload" size={size} color={color} />
);
export const SummaryIcon = ({ size = 26, color = "#000" }: IconProps) => (
    <MaterialIcons name="summarize" size={size} color={color} />
);

export const HospitalIcon = ({ size = 26, color = "#000" }: IconProps) => (
    <MaterialCommunityIcons
        name="hospital-building"
        size={size}
        color={color}
    />
);



export const AddIcon = ({ size = 26, color = "#000" }: IconProps) => (
    <Feather name="plus" size={size} color={color} />
);
export const CopyIcon = ({ size = 26, color = "#000" }: IconProps) => (
    <FontAwesome6 name="copy" size={size} color={color} />
);
export const ClipIcon = ({ size = 26, color = "#000" }: IconProps) => (
    <Fontisto name="paperclip" size={size} color={color} />
);
export const ImageIcon = ({ size = 26, color = "#000" }: IconProps) => (
    <MaterialIcons name="image" size={size} color={color} />
);
export const DangerIcon = ({ size = 26, color = "#000" }: IconProps) => (
    <Ionicons name="alert-circle-outline" size={size} color={color} />
);

export const HeadRightIcon = ({ size = 26, color = "#000" }: IconProps) => (
    <FontAwesome
        name="angle-right"
        size={size}
        color={color}
    />
);
export const HeadDownIcon = ({ size = 26, color = "#000" }: IconProps) => (
    <FontAwesome
        name="angle-down"
        size={size}
        color={color}
    />
);

/* ================= LOCATION / CALENDAR ================= */

export const LocationIcon = ({ size = 24, color = "#000" }: IconProps) => (
    <Ionicons name="location-outline" size={size} color={color} />
);

export const PermissionIcon = ({ size = 24, color = "#000" }: IconProps) => (
    <FontAwesome6 name="list-check" size={size} color={color} />
);
export const NotFound = ({ size = 24, color = "#000" }: IconProps) => (
    <MaterialIcons name="error-outline" size={size} color={color} />
);

export const CalenderIcon = ({ size = 24, color = "#000" }: IconProps) => (
    <Ionicons name="calendar-outline" size={size} color={color} />
);

export const UploadIcon = ({ size = 24, color = "#000" }: IconProps) => (
    <Feather name="upload" size={size} color={color} />
);
export const ShareIcon = ({ size = 24, color = "#000" }: IconProps) => (
    <EvilIcons name="share-google" size={size} color={color} />
);
export const DeleteIcom = ({ size = 24, color = "#000" }: IconProps) => (
    <MaterialIcons name="delete-outline" size={size} color={color} />
);


