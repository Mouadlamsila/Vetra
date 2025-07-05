"use client"

import { useState, useEffect } from "react"
import { Tag, Pencil, Trash2, Plus, Save, Upload } from "lucide-react"
import axios from "axios"
import { useTranslation } from 'react-i18next'

export default function Categories() {
  const { t } = useTranslation()
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", photo: null, photoPreview: null })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refresh, setRefresh] = useState(false)
  const language = localStorage.getItem("lang")

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://stylish-basket-710b77de8f.strapiapp.com/api/categorie-products?populate=*')
        setCategories(response.data.data)
        setIsLoading(false)
      } catch (err) {
        setError('Failed to fetch categories')
        setIsLoading(false)
        console.error('Error fetching categories:', err)
      }
    }

    fetchCategories()
  }, [refresh])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }))
      // Create preview URL for the selected file
      const previewUrl = URL.createObjectURL(file)
      setFormData((prev) => ({ ...prev, photoPreview: previewUrl }))
    }
  }

  const openEditModal = (category) => {
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      photo: null,
      photoPreview: category.photo?.url 
        ? `${category.photo.url}`
        : null
    })
    setEditModalOpen(true)
  }

  const openDeleteModal = (category) => {
    setSelectedCategory(category)
    setDeleteModalOpen(true)
  }

  const handleCreateCategory = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let photoId = null
      if (formData.photo) {
        const formDataPhoto = new FormData()
        formDataPhoto.append('files', formData.photo)
        const uploadResponse = await axios.post('https://stylish-basket-710b77de8f.strapiapp.com/api/upload', formDataPhoto)
        photoId = uploadResponse.data[0].id
      }

      const response = await axios.post('https://stylish-basket-710b77de8f.strapiapp.com/api/categorie-products', {
        data: {
          name: formData.name,
          photo: photoId
        }
      })

      // Update categories with the new category including photo data
      const newCategory = {
        ...response.data.data,
        photo: photoId ? { formats: { thumbnail: { url: formData.photoPreview } } } : null
      }
      setCategories([...categories, newCategory])
      setCreateModalOpen(false)
      setFormData({ name: "", photo: null, photoPreview: null })
      setRefresh(!refresh)
    } catch (error) {
      console.error('Error creating category:', error)
      setError('Failed to create category')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateCategory = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let photoId = selectedCategory.photo?.id
      if (formData.photo) {
        const formDataPhoto = new FormData()
        formDataPhoto.append('files', formData.photo)
        const uploadResponse = await axios.post('https://stylish-basket-710b77de8f.strapiapp.com/api/upload', formDataPhoto)
        console.log(uploadResponse.data[0].url)
        photoId = uploadResponse.data[0].id
      }

      const response = await axios.put(`https://stylish-basket-710b77de8f.strapiapp.com/api/categorie-products/${selectedCategory.documentId}`, {
        data: {
          name: formData.name,
          photo: photoId
        }
      })
      setRefresh(!refresh)

    //   // Update categories with the updated category including photo data
    //   const updatedCategory = {
    //     ...response.data.data,
    //     photo: photoId ? { formats: { thumbnail: { url: formData.photoPreview } } } : selectedCategory.photo
    //   }
    //   const updatedCategories = categories.map((cat) =>
    //     cat.id === selectedCategory.id ? updatedCategory : cat
    //   )

    //   setCategories(updatedCategories)
      setEditModalOpen(false)
    } catch (error) {
      console.error('Error updating category:', error)
      setError('Failed to update category')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCategory = async () => {
    setIsSubmitting(true)

    try {
      await axios.delete(`https://stylish-basket-710b77de8f.strapiapp.com/api/categorie-products/${selectedCategory.documentId}`)
      
      const filteredCategories = categories.filter((cat) => cat.id !== selectedCategory.id)
      setCategories(filteredCategories)
      setDeleteModalOpen(false)
    } catch (error) {
      console.error('Error deleting category:', error)
      setError('Failed to delete category')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('categoriesAdmin.title')}</h1>
          <p className="text-gray-500">{t('categoriesAdmin.subtitle')}</p>
        </div>
        <button
          className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-[#6D28D9] text-white rounded-md hover:bg-[#5b21b6] transition-colors"
          onClick={() => {
            setFormData({ name: "", photo: null, photoPreview: null })
            setCreateModalOpen(true)
          }}
        >
          <Plus className={`${language === "ar" ? "ml-2" : "mr-2"} h-4 w-4`} />
          {t('categoriesAdmin.addCategory')}
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="relative h-48">
              {category.photo?.formats?.medium?.url ? (
                <img
                  src={`${category.photo.formats.medium.url}`}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-purple-100 flex items-center justify-center">
                  <Tag className="h-12 w-12 text-purple-600" />
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold capitalize">{category.name}</h3>
                <span className="px-2 py-1 bg-[#c8c2fd] text-[#6D28D9] text-xs font-medium rounded-full">
                  {t('categoriesAdmin.table.id', { id: category.id })}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {t('categoriesAdmin.table.createdAt')}: {new Date(category.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">{t('categoriesAdmin.allCategories')}</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('categoriesAdmin.table.category')}
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('categoriesAdmin.table.createdAt')}
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('categoriesAdmin.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 ${language === "ar" ? "ml-3" : "mr-3"}`}>
                        {category.photo?.url ? (
                          <img
                            src={`${category.photo.url}`}
                            alt={category.name}
                            className="h-full w-full object-cover rounded-lg"
                          />
                        ) : (
                          <Tag className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-700 capitalize">{category.name}</p>
                        <p className="text-gray-500 text-xs">{t('categoriesAdmin.table.documentId', {id :category.documentId})}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#c8c2fd] text-[#6D28D9]">
                      #{category.id}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        title={t('categoriesAdmin.modals.edit.title')}
                        onClick={() => openEditModal(category)}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        title={t('categoriesAdmin.modals.delete.title')}
                        onClick={() => openDeleteModal(category)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {categories.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">{t('categoriesAdmin.noCategories')}</p>
          </div>
        )}
      </div>

      {/* Create Category Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t('categoriesAdmin.modals.create.title')}</h3>
                <form onSubmit={handleCreateCategory}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('categoriesAdmin.form.name.label')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9]"
                      placeholder={t('categoriesAdmin.form.name.placeholder')}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('categoriesAdmin.form.photo.label')}
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="photo-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-[#6D28D9] hover:text-[#5b21b6] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#6D28D9]"
                          >
                            <span>{t('categoriesAdmin.form.photo.upload')}</span>
                            <input
                              id="photo-upload"
                              name="photo"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handlePhotoChange}
                            />
                          </label>
                          <p className="pl-1">{t('categoriesAdmin.form.photo.dragDrop')}</p>
                        </div>
                        <p className="text-xs text-gray-500">{t('categoriesAdmin.form.photo.format')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#6D28D9] text-base font-medium text-white hover:bg-[#5b21b6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6D28D9] sm:ml-3 sm:w-auto sm:text-sm"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span>{t('categoriesAdmin.modals.create.buttons.creating')}</span>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          {t('categoriesAdmin.modals.create.buttons.create')}
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6D28D9] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => setCreateModalOpen(false)}
                      disabled={isSubmitting}
                    >
                      {t('categoriesAdmin.modals.create.buttons.cancel')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t('categoriesAdmin.modals.edit.title')}</h3>
                <form onSubmit={handleUpdateCategory}>
                  <div className="mb-4">
                    <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('categoriesAdmin.form.name.label')}
                    </label>
                    <input
                      type="text"
                      id="edit-name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9]"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="edit-photo" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('categoriesAdmin.form.photo.label')}
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        {formData.photoPreview ? (
                          <img
                            src={formData.photoPreview}
                            alt={selectedCategory.name}
                            className="mx-auto h-24 w-24 object-cover rounded-md"
                          />
                        ) : (
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        )}
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="edit-photo-upload"
                            className="relative cursor-pointer flex w-full justify-center text-center bg-white rounded-md font-medium text-[#6D28D9] hover:text-[#5b21b6] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#6D28D9]"
                          >
                            <span>{t('categoriesAdmin.modals.edit.buttons.changePhoto')}</span>
                            <input
                              id="edit-photo-upload"
                              name="photo"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handlePhotoChange}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">{t('categoriesAdmin.form.photo.format')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#6D28D9] text-base font-medium text-white hover:bg-[#5b21b6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6D28D9] sm:ml-3 sm:w-auto sm:text-sm"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span>{t('categoriesAdmin.modals.edit.buttons.updating')}</span>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          {t('categoriesAdmin.modals.edit.buttons.update')}
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6D28D9] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => setEditModalOpen(false)}
                      disabled={isSubmitting}
                    >
                      {t('categoriesAdmin.modals.edit.buttons.cancel')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {t('categoriesAdmin.modals.delete.title')}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {t('categoriesAdmin.modals.delete.message', { name: selectedCategory?.name })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDeleteCategory}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('categoriesAdmin.modals.delete.buttons.processing') : t('categoriesAdmin.modals.delete.buttons.confirm')}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6D28D9] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setDeleteModalOpen(false)}
                  disabled={isSubmitting}
                >
                  {t('categoriesAdmin.modals.delete.buttons.cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
