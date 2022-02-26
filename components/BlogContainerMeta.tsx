import { FC } from 'react';

const BlogContainerMeta: FC = ({ children }) => (
  <div className="px-4 pt-24 pb-20 sm:px-6 lg:px-8 lg:pb-28">
    <div className="relative mx-auto max-w-lg lg:max-w-7xl">{children}</div>
  </div>
);

export default BlogContainerMeta;
